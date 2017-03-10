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
    return new Promise((resolve) => {
        if (!fs.existsSync(sourceResult.repoDir)) {
            return git.clone(sourceResult.clone, sourceResult.repoDir, (err, data) => {
                output.error(err);
                return resolve(sourceResult);
            });
        } else {
            return resolve(sourceResult);
        }
    });
}
