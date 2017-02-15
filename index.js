#!/usr/bin/env node
const cli = require('./cli');
const argv = require('./argv');
const setTarget = require('./lib/setTarget');

cli(argv)
    .then(setTarget)
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
