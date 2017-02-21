'use strict';
const fs = require('./fs');
const rootDir = require('./rootDir');
const path = require('path');

module.exports = setTarget;
const TARGET_PATH = path.normalize(process.env.HOME + '/.bitcar/.bitcar_target');

function setTarget(sourceResult) {
    return new Promise((resolve, reject) => {
        if (sourceResult && sourceResult.repoDir) {
            fs.write(TARGET_PATH, sourceResult.repoDir);
            fs.commit((err) => {
                if (err) return reject(err);
                return resolve(sourceResult.repoDir);
            });
        }
    });
}
