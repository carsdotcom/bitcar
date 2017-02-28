#!/usr/bin/env node
/* istanbul ignore next */
(function() {

const cli = require('./cli');
const argv = require('./argv');
const setTarget = require('./lib/setTarget');

cli(argv)
    .then(setTarget)
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });

}());
