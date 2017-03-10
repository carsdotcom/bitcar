'use strict';
const chalk = require('chalk');
const _ = require('lodash');

module.exports = {
    log: (...args) => {
        console.log.apply(console, args);
    },
    error: (...args) => {
        if (args[0] != null) {
            console.error.apply(console, _.map(args, chalk.bold.red));
        }
    }
};
