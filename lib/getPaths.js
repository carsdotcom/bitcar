'use strict';
const _ = require('lodash');
const path = require('path');

module.exports = getPaths;

function getPaths(sourceData) {
    let names = [];
    _.forIn(sourceData, (repos, sourceName) => {
        _.forEach(repos, (repo) => {
            names.push(path.normalize(sourceName + '/' + repo.name));
        });
    });
    return names;
}
