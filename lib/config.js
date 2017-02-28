'use strict';
const rc = require('rc')('bitcar', {});

module.exports = {
    get: () => rc
};
