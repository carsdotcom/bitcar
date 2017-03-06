'use strict';
const fs = require('./fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const config = require('./config');
const drivers = require('../drivers');
const output = require('./output');
const readdirp = require('readdirp');

module.exports = syncExisting;
const CACHE_PATH = path.normalize(process.env.HOME + '/.bitcar/cache.json');

function syncExisting() {
    output.log('Attempting to sync existing workspace with cache...');
    let cache = fs.readJSON(CACHE_PATH);
    let rc = config.get();
    const hosts = _.map(rc.drivers, 'host');
    const paths = _.map(hosts, (host) => path.join(workspaceDir, host));

    function readdirpFilter(result) {
        return _.reduce(paths, (acc, p) => {
            let pattern = new RegExp('^' + _.escapeRegExp(p));
            acc = acc || pattern.test(result.fullPath);
            return acc;
        }, false);
    }

    function resultFilter(result) {
        return _.reduce(paths, (acc, p) => {
            let pattern = new RegExp('^' + _.escapeRegExp(p) + '.+\/.+');
            acc = acc || pattern.test(result.fullPath);
            return acc;
        }, false);
    }

    return new Promise((resolve, reject) => {
        let entries = [];
        readdirp({ root: workspaceDir, entryType: 'directories', directoryFilter: readdirpFilter, depth: 2 })
            .on('data', (result) => {
                if (resultFilter(result)) {
                    let entry = {};
                    let resultArr = result.fullPath.split(path.sep);
                    let host = resultArr[resultArr.length - 3];
                    let name = _.takeRight(resultArr, 2).join(path.sep);
                    entry = { host, name };
                    entries.push(entry);
                }
            })
            .on('end', () => {
                entries = _.reduce(entries, (acc, entry) => {
                    if (!acc[entry.host]) acc[entry.host] = [];
                    acc[entry.host].push({ name: entry.name });
                    return acc;
                }, {});

                let sourceData = _.reduce(_.union(_.keys(entries, cache)), (kacc, key) => {
                    kacc[key] = _.reduce(_.union(_.map(cache[key], 'name'), _.map(entries[key], 'name')), (eacc, name) => {
                        eacc.push(_.assign({}, _.find(entries[key], { name }), _.find(cache[key], { name })));
                        return eacc;
                    }, []);
                    return kacc;
                }, {});

                sourceData['github.com'] = _.map(sourceData['github.com'] || [], (repo) => {
                    let name = _.lowerCase(_.replace(repo.name, ' ', '-'));
                    if (!repo.clone) repo.clone = 'https://github.com/' + repo.name + '.git';
                    if (!repo.html) repo.html = 'https://github.com/' + repo.name;
                    return repo;
                });

                fs.writeJSON(CACHE_PATH, sourceData, null, 4);
                fs.commit((err) => {
                    if (err) return reject(err);
                    output.log('Cache set successfully');
                    return resolve(sourceData);
                });
            });
    });
}
