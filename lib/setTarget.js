'use strict';
const fs = require('./fs');
const rootDir = require('./rootDir');
const path = require('path');

module.exports = setTarget;

function setTarget(sourceResult) {
    return new Promise((resolve, reject) => {
        if (sourceResult && sourceResult.repoDir) {
            fs.write(path.normalize(rootDir + '/.bitcar_target'), sourceResult.repoDir);
            fs.commit((err) => {
                if (err) return reject(err);
                return resolve(sourceResult.repoDir);
            });
        }
    });
}
