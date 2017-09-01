'use strict';
const Promise = require('bluebird');
const fs = require('./fs');
const workspaceDir = require('./workspaceDir');
const path = require('path');

module.exports = setTarget;
const TARGET_PATH = path.normalize(process.env.HOME + '/.bitcar/.bitcar_target');

function setTarget(sourceResult) {
    if (sourceResult && sourceResult.repoDir) {
        fs.write(TARGET_PATH, sourceResult.repoDir);
        return Promise.promisify(fs.commit, { context: fs })().then(() => sourceResult.repoDir);
    } else {
        return Promise.resolve();
    }
}
