'use strict';

const fs = require('./fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const rootDir = require('./rootDir');
const rc = require('rc')('bitcar', {});

module.exports = getSourceData;

function getSourceData(forceRefresh = false) {
    if (fs.exists(path.normalize(__dirname + '/../sources/.cache.json')) && !forceRefresh) {
        return Promise.resolve(fs.readJSON(__dirname + '/../sources/.cache.json'));
    } else {
        const config = fs.readJSON(path.normalize(process.env.HOME + '/.bitcar/config'));
        const sources = require('../sources');
        console.log('Loading cache now. This will only happen once.');
        console.log('In the future, to refresh the cache run `' + config.alias + ' --refresh`.');
        let sourceKeys = _.keys(sources);
        let sourceValues = _.values(sources);
        return Promise.mapSeries(sourceValues, (source) => source(rc))
            .then((sourceData) => {
                let mappedSourceData = _.zipObject(sourceKeys, sourceData);
                mappedSourceData = _.mapValues(mappedSourceData, _.flow(_.flattenDeep, _.partialRight(_.uniqBy, 'name')));
                return new Promise((resolve, reject) => {
                    fs.writeJSON(path.normalize(__dirname + '/../sources/.cache.json'), mappedSourceData, null, 4);
                    fs.commit((err) => {
                        if (err) return reject(err);
                        return resolve(mappedSourceData);
                    });
                });
            });
    }
}
