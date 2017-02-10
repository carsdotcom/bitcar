#!/usr/bin/env node
const cli = require('./cli');
const argv = require('optimist').argv;

cli(argv)
    .then((sourceResult) => {
        if (sourceResult && sourceResult.repoDir) {
            console.log(sourceResult.repoDir);
        }
    })
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
