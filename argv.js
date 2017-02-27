'use strict';
module.exports = require('minimist')(process.argv.slice(2), {
    alias: {
        version: 'v',
        open: 'o',
        refresh: 'r',
        edit: 'e'
    }
});
