'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const git = require('simple-git')(workspaceDir)
    .outputHandler(function (command, stdout, stderr) {
        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);
     });

module.exports = maybeClone;

function maybeClone(sourceResult) {
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
