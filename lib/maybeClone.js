'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const output = require('./output');
const gitFactory = require('./gitFactory');
let git;

module.exports = maybeClone;

function maybeClone(sourceResult) {
    if (!git) {
        git = gitFactory.getInstance(workspaceDir);
    }
    if (!fs.existsSync(sourceResult.repoDir)) {
        return Promise.promisify(git.clone, { context: git })(sourceResult.clone, sourceResult.repoDir)
            .then(() => sourceResult)
            .catch((err) => {
                output.error(err);
                return sourceResult;
            });
    } else {
        return Promise.resolve(sourceResult);
    }
}
