'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const rootDir = require('./rootDir');
const rc = require('rc')('bitcar', {});

module.exports = getSourceData;

function getSourceData(forceRefresh = false) {
    if (fs.existsSync(path.normalize(__dirname + '/../sources/.cache.json')) && !forceRefresh) {
        return Promise.resolve(require(__dirname + '/../sources/.cache.json'));
    } else {
        console.log('No cache found.');
        const sources = require('../sources');
        console.log('Loading cache now. This will only happen once.');
        console.log('In the future, to refresh the cache run `bitcar --refresh`.');
        return Promise.props(_.mapValues(sources, (source) => source(rc))).then((sourceData) => {
            return new Promise(function (resolve, reject) {
                return fs.writeFile(path.normalize(__dirname + '/../sources/.cache.json'), JSON.stringify(sourceData, null, 4), 'utf8', function (err) {
                    if (err) return reject(err);
                    return resolve({ repoDir: rootDir });
                });
            });
        });
    }
}
