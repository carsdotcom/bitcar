'use strict';
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const getSourceData = require('./getSourceData');

module.exports = getSourceResult;

function getSourceResult(repoDir) {
    const repoParts = repoDir.split(path.sep);
    const sourceName = repoParts.shift();
    const repoName = repoParts.join(path.sep);
    return getSourceData().then((sourceData) => {
        const sourceResult = _.find(sourceData[sourceName], { name: repoName });
        sourceResult.repoDir = path.join(workspaceDir, repoDir);
        return sourceResult;
    });
}
