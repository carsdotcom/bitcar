'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const gitFactory = require('./gitFactory');
const output = require('./output');
const chalk = require('chalk');

module.exports = status;

function status(sourceResult) {
    return new Promise((resolve) => {
        if (fs.existsSync(sourceResult.repoDir)) {
            let git = gitFactory.getInstance(sourceResult.repoDir, false);
            return git.status((statusErr, status) => {
                output.error(statusErr);
                output.log(`${sourceResult.name}: ${status.isClean() ? chalk.green('clean') : chalk.red('dirty')}`);
                if (!status.isClean()) {
                    output.log(`${JSON.stringify(status, null, 4)}`);
                }
                return resolve(sourceResult);
            });
        } else {
            return resolve(sourceResult);
        }
    });
}
