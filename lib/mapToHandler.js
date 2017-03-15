'use strict';
const _ = require('lodash');
const Promise = require('bluebird');
const getSourceResult = require('./getSourceResult');
const output = require('./output');
const inquirer = require('inquirer');
const workspaceDir = require('./workspaceDir');

module.exports = mapToHandler;

function mapToHandler(options) {
        let { results, confirmMessage, errorMessage, handler } = options;
        return Promise.all(_.map(results, getSourceResult)).then((repos) => {
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
                    return Promise.resolve(repos).mapSeries(handler).then(() => {
                        return { repoDir: workspaceDir };
                    });
                } else {
                    throw new Error(errorMessage);
                }
            });
        });
}
