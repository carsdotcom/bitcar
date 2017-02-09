'use strict';
const _ = require('lodash');
const axios = require('axios');
const Promise = require('bluebird');

module.exports = githubSourcePromise;

function githubSourcePromise(config) {
    const githubConfig = _.find(config.sources, { type: 'github' });
    if (githubConfig && githubConfig.usernames) {
        return Promise.map(githubConfig.usernames, (username) => {
            const endpoint = `https://api.github.com/users/${username}/repos`;
            return axios.get(endpoint).then((res) => {
                const sources = _.map(res.data, (item) => {
                    const result = {};
                    result.name = item.full_name;
                    result.clone = item.clone_url;
                    result.html = item.html_url;
                    return result;
                });
                return sources;
            });
        }).reduce((acc, result) => {
            acc = acc.concat(result);
            return acc;
        }, []);
    } else {
        return Promise.resolve([]);
    }
}
