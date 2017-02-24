'use strict';
module.exports = {
    log: (...args) => {
        console.log.apply(console, args);
    }
};
