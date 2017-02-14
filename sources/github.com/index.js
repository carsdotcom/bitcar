'use strict';
const _ = require('lodash');
const axios = require('axios');
const Promise = require('bluebird');

module.exports = githubSourcePromise;

function githubSourcePromise(config) {
    const githubConfig = _.find(config.sources, { type: 'github' });
    let resultPromises = [];
    if (githubConfig && githubConfig.accessToken) {
        let reqUrl = `https://api.github.com/user/repos?access_token=${githubConfig.accessToken}&per_page=100`;
        resultPromises = resultPromises.concat(axios.get(reqUrl).then((res) => {
            const sources = _.map(res.data, (item) => {
                const result = {};
                result.name = item.full_name;
                result.clone = item.clone_url;
                result.html = item.html_url;
                return result;
            });
            return sources;
        }));
    }
    if (githubConfig && githubConfig.usernames) {
        resultPromises = resultPromises.concat(Promise.map(githubConfig.usernames, (username) => {
            let reqUrl = `https://api.github.com/users/${username}/repos`;
            return axios.get(reqUrl).then((res) => {
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
        }, []));
    } else {
        return Promise.resolve([]);
    }
    return Promise.all(resultPromises);
}
