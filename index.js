#!/usr/bin/env node
/* istanbul ignore next */
(function() {

const router = require('./router');
const argv = require('./argv');
const setTarget = require('./lib/setTarget');

router(argv)
    .then(setTarget)
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });

}());
