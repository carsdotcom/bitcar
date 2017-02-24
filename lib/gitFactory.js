'use strict';
module.exports = {
    getInstance: (workspaceDir) => {
        const git = require('simple-git')(workspaceDir)
            .outputHandler(function (command, stdout, stderr) {
                stdout.pipe(process.stdout);
                stderr.pipe(process.stderr);
             });
        return git;
    }
};
