'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const gitFactory = require('./gitFactory');
let git;

module.exports = maybeClone;

function maybeClone(sourceResult) {
    if (!git) {
        git = gitFactory.getInstance(workspaceDir);
    }
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(sourceResult.repoDir)) {
            return git.clone(sourceResult.clone, sourceResult.repoDir, (err, data) => {
                if (err) return reject(err);
                return resolve(sourceResult);
            });
        } else {
            return resolve(sourceResult);
        }
    });
}
