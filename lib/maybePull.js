'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const gitFactory = require('./gitFactory');
const output = require('./output');

module.exports = forceLatest;

function forceLatest(sourceResult) {
    return new Promise((resolve) => {
        if (fs.existsSync(sourceResult.repoDir)) {
            let git = gitFactory.getInstance(sourceResult.repoDir);
            return git.checkout('master', (checkoutErr) => {
                output.error(checkoutErr);
                return git.pull('origin', 'master', { '--rebase': true }, (pullErr, data) => {
                    output.error(pullErr);
                    return resolve(sourceResult);
                });
            });
        } else {
            return resolve(sourceResult);
        }
    });
}
