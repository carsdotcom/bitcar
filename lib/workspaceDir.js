'use strict';
const path = require('path');
const fs = require('fs');
const envWorkspaceDir = process.env.BITCAR_WORKSPACE_DIR;
const defaultWorkspaceDir = `${process.env.HOME}/bitcar-repos`;
const workspaceDir = (envWorkspaceDir) ? path.normalize(envWorkspaceDir) : path.normalize(defaultWorkspaceDir);

if (!fs.existsSync(workspaceDir)) {
    fs.mkdirSync(workspaceDir);
}

module.exports = workspaceDir;
