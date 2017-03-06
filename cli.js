'use strict';
const lib = require('./lib');
const _ = require('lodash');
const inquirer = require('inquirer');
const path = require('path');
const Promise = require('bluebird');
const workspaceDir = require('./lib/workspaceDir');
const output = require('./lib/output');

module.exports = cli;

process.on('SIGINT', () => {
    process.exit(1);
});

function setSearchTerm(options) {
    let searchTerm;
    let defaultToCurrent = _.pick(options, [
        'open',
        'edit'
    ]);
    let defaultToWild = _.pick(options, [
        'completions',
        'clone-all',
        'force-latest'
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

function mapToHandler(options) {
        let { results, confirmMessage, errorMessage, handler } = options;
        return Promise.all(_.map(results, lib.getSourceResult)).then((repos) => {
            _.each(repos, (r) => output.log(r.name));
            return inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: confirmMessage,
                    default: false
                }
            ]).then((answers) => {
                if (answers.confirm) {
                    return Promise.resolve(repos).map(handler).then(() => {
                        return { repoDir: workspaceDir };
                    });
                } else {
                    throw new Error(errorMessage);
                }
            });
        });
}

function cli(options) {
    let searchTerm = setSearchTerm(options);

    if (options.version) {
        output.log(require('./package.json').version);
        return Promise.resolve();
    }

    if (options.setup) {
        return require('./setup')();
    }

    if (options['sync-existing']) {
        return lib.syncExisting();
    }

    if (options.refresh) {
        return lib.getSourceData(true);
    } else {
        const sourceDataPromise = lib.getSourceData();
        const pathsPromise = sourceDataPromise.then(lib.getPaths).filter((v) => (new RegExp(searchTerm)).test(v));
        if (options.completions) {
            return pathsPromise.map((result) => _.tail(result.split(path.sep)).join(path.sep))
                .each(_.ary(output.log, 1));
        } else {
            return pathsPromise.then((results) => {
                let resultPromise;
                if (results.length && options['clone-all']) {
                    return mapToHandler({
                        results,
                        confirmMessage: 'Are you sure you want clone all of the above?',
                        errorMessage: 'Clone all aborted',
                        handler: lib.maybeClone
                    });
                } else if (results.length && options['force-latest']) {
                    return mapToHandler({
                        results,
                        confirmMessage: 'Are you sure you want clean and force a hard reset to all of the above?',
                        errorMessage: 'Force latest aborted',
                        handler: lib.forceLatest
                    });
                } else if (results.length > 1) {
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
                    throw new Error('No results.');
                }
                if (options.open) {
                    resultPromise = resultPromise.then(lib.openInBrowser).then(lib.maybeClone);
                } else {
                    resultPromise = resultPromise.then(lib.maybeClone);
                }
                return resultPromise;
            });
        }
    }
}
