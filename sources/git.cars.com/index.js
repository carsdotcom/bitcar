'use strict';
const _ = require('lodash');
const axios = require('axios');
const Promise = require('bluebird');
const inquirer = require('inquirer');

module.exports = bitbucketSourcePromise;

function bitbucketSourcePromise(config) {
    const bitbucketConfig = _.find(config.sources, { type: 'bitbucketServer' });
    if (bitbucketConfig && bitbucketConfig.host) {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: bitbucketConfig.host + ' username:'
            },
            {
                type: 'password',
                name: 'password',
                message: bitbucketConfig.host + ' password:'
            }
        ]).then((answers) => {
            const auth = {
                username: answers.username,
                password: answers.password
            };
            return axios.request({
                url: `https://${bitbucketConfig.host}/rest/api/1.0/projects/?limit=10000`,
                auth
            }).then((res) => {
                const projects = _.map(res.data.values, (v) => v.key.toLowerCase());
                return projects;
            }).then((projects) => {
                return Promise.reduce(projects, (acc, project) => {
                    return axios.request({
                        url: `https://${bitbucketConfig.host}/rest/api/1.0/projects/${project}/repos?limit=10000`,
                        auth
                    }).then((res) => {
                        const repos = _.map(res.data.values, (v) => {
                            let result = {};
                            result.name = project + '/' + v.name;
                            result.clone = _.find(v.links.clone, { name: 'http' }).href;
                            result.html = v.links.self[0].href;
                            return result;
                        });
                        acc = acc.concat(repos);
                        return acc;
                    });
                }, []);
            });
        });
    } else {
        return Promise.resolve([]);
    }
}
