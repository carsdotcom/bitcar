'use strict';
const _ = require('lodash');
const path = require('path');

module.exports = getSearchTerm;

function getSearchTerm(options) {
    let searchTerm;
    let defaultToCurrent = _.pick(options, [
        'open',
        'edit'
    ]);
    let defaultToWild = _.pick(options, [
        'completions',
        'clone-all',
        'force-latest',
        'pull-all'
    ]);
    if (options._ && options._[0]) {
        searchTerm = options._[0];
    } else if (_.keys(defaultToCurrent).length) {
        searchTerm = _.reduce(_.values(defaultToCurrent), (acc, value) => {
            return _.isString(value) ? value : acc;
        }, '^' + _.takeRight(process.cwd().split(path.sep), 3).join(path.sep) + '$');
    } else if (_.keys(defaultToWild).length) {
        searchTerm = _.reduce(_.values(defaultToWild), (acc, value) => {
            return _.isString(value) ? value : acc;
        }, '.*');
    }
    return searchTerm;
}
