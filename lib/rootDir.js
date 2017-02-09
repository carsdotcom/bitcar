'use strict';
const path = require('path');
const fs = require('fs');
const envRoot = process.env.BITCAR_ROOT_DIR;
const defaultRootDir = `${process.env.HOME}/bitcar-repos`;
const rootDir = (envRoot) ? path.normalize(envRoot) : path.normalize(defaultRootDir);

if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir);
}

module.exports = rootDir;
