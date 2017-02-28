'use strict';
const fs = require('./fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const config = require('./config');
const drivers = require('../drivers');
const output = require('./output');

module.exports = getSourceData;
const CACHE_PATH = path.normalize(process.env.HOME + '/.bitcar/cache.json');

function getSourceData(forceRefresh = false) {
    let rc = config.get();
    if (fs.exists(CACHE_PATH) && !forceRefresh) {
        return Promise.resolve(fs.readJSON(CACHE_PATH));
    } else {
        output.log('Loading cache...');
        const selected = _.pick(drivers, _.map(rc.drivers, (v) => v.type));
        return Promise.props(_.mapValues(selected, (driver) => driver(rc)))
            .then((sourceData) => {
                sourceData = _.mapValues(sourceData, _.flow(_.flattenDeep, _.compact));
                sourceData = _.mapValues(sourceData, (entries) => _.uniqBy(entries, 'name'));
                sourceData = _.mapKeys(sourceData, (v, k) => {
                    return _.find(rc.drivers, { type: k }).host;
                });
                return new Promise((resolve, reject) => {
                    fs.writeJSON(CACHE_PATH, sourceData, null, 4);
                    fs.commit((err) => {
                        if (err) return reject(err);
                        output.log('Cache set successfully');
                        return resolve(sourceData);
                    });
                });
            });
    }
}
