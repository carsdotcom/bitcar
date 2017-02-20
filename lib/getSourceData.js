'use strict';
const fs = require('./fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const rootDir = require('./rootDir');
const rc = require('rc')('bitcar', {});

module.exports = getSourceData;
const CACHE_PATH = path.normalize(process.env.HOME + '/.bitcar/cache.json');

function getSourceData(forceRefresh = false) {
    if (fs.exists(CACHE_PATH) && !forceRefresh) {
        return Promise.resolve(fs.readJSON(CACHE_PATH));
    } else {
        const config = fs.readJSON(path.normalize(process.env.HOME + '/.bitcar/config'));
        const sources = require('../sources');
        console.log('Loading cache...');
        return Promise.props(_.mapValues(sources, source => source(rc)))
            .then((sourceData) => {
                sourceData = _.mapValues(sourceData, _.flow(_.flattenDeep, _.compact));
                sourceData = _.mapValues(sourceData, (entries) => _.uniqBy(entries, 'name'));
                return new Promise((resolve, reject) => {
                    let bitbucketConfig = _.find(rc.sources, { type: 'bitbucket-server' });
                    if (bitbucketConfig) {
                        sourceData[bitbucketConfig.host] = sourceData['bitbucket-server'];
                        delete sourceData['bitbucket-server'];
                    }
                    fs.writeJSON(CACHE_PATH, sourceData, null, 4);
                    fs.commit((err) => {
                        if (err) return reject(err);
                        console.log('Cache set successfully');
                        return resolve(sourceData);
                    });
                });
            });
    }
}
