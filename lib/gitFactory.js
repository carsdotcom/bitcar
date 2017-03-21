'use strict';
module.exports = {
    getInstance: (workspaceDir, streamOutput = true) => {
        const git = require('simple-git')(workspaceDir)
            .outputHandler(function (command, stdout, stderr) {
                if (streamOutput) {
                    stdout.pipe(process.stdout);
                    stderr.pipe(process.stderr);
                }
             });
        return git;
    }
};
