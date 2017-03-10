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
            return git.fetch([ 'origin' ], (fetchErr) => {
                if (fetchErr) output.log('Error trying to fetch ' + sourceResult.clone + '. Message: ' + fetchErr);
                git.reset([ '--hard', 'origin/master' ], (resetErr) => {
                    if (resetErr) output.log('Error trying to reset hard to origin/master for ' + sourceResult.clone + '. Message: ' + resetErr);
                    return git.clean('f', [ '-d' ], (cleanErr) => {
                        output.error(cleanErr);
                        git = null;
                        return resolve(sourceResult);
                    });
                });
            });
        } else {
            return resolve(sourceResult);
        }
    });
}
