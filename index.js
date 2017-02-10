#!/usr/bin/env node
'use strict';
const lib = require('./lib');
const argv = require('optimist').argv;
const _ = require('lodash');
const inquirer = require('inquirer');
const path = require('path');

const refresh = _.partial(lib.getSourceData, true);
const init = refresh;

function main(options) {
    let searchTerm;

    if (options.setup) {
        require('./setup');
        return Promise.resolve(null);
    }

    if (_.isString(options.completions)) {
        searchTerm = options.completions;
    } else if (_.isString(options.open)) {
        searchTerm = options.open;
    } else if (options._ && options._[0]) {
        searchTerm = options._[0];
    } else if (!options.completions) {
        searchTerm = _.takeRight(process.cwd().split(path.sep), 3).join(path.sep);
    }

    if (options.init) {
        return init();
    } else if (options.refresh) {
        return refresh();
    } else {
        const searchFilter = (v) => (new RegExp(searchTerm)).test(v);
        const sourceDataPromise = lib.getSourceData();
        const pathsPromise = sourceDataPromise.then(lib.getPaths).filter(searchFilter);
        if (options.completions) {
            return pathsPromise.map(_.ary(console.log, 1));
        } else {
            return pathsPromise.then((results) => {
                let resultPromise;
                if (results.length > 1) {
                    resultPromise = inquirer.prompt([
                        {
                            type: 'list',
                            name: 'result',
                            message: 'search results',
                            choices: results
                        }
                    ]).then((answers) => lib.getSourceResult(answers.result));
                } else if (results.length) {
                    resultPromise = lib.getSourceResult(results[0]);
                } else {
                    throw new Error('No results');
                }
                if (options.open) {
                    return resultPromise.then(lib.openInBrowser).then(lib.maybeClone);
                } else {
                    return resultPromise.then(lib.maybeClone);
                }
            });
        }
    }
}

main(argv)
    .then((sourceResult) => {
        if (sourceResult && sourceResult.repoDir) {
            console.log(sourceResult.repoDir);
        }
    })
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
