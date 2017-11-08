'use strict';
const _ = require('lodash');
const axios = require('axios');
const Promise = require('bluebird');
const config = require('../../lib/config');

module.exports =  {
    createRepo,
    getConfiguredRepos,
    getOwnRepos,
    getReposFromUsernames
};

function createRepo(options) {
    let githubConfig = _.find(config.get().drivers, { type: 'github' });
    const url = `https://api.github.com/user/repos?access_token=${githubConfig.accessToken}`;
    return axios.post(url, {
        name: options.name,
        description: "created by bitcar",
        private: options.private || false
    });
}

function getConfiguredRepos(config) {
    const githubConfig = _.find(config.drivers, { type: 'github' });
    let resultPromises = [];
    if (githubConfig && githubConfig.accessToken) {
        resultPromises.push(getOwnRepos(githubConfig));
    }
    if (githubConfig && githubConfig.usernames) {
        resultPromises = resultPromises.concat(getReposFromUsernames(githubConfig));
    }
    if (!resultPromises.length) {
        return Promise.resolve([]);
    }
    return Promise.all(resultPromises);
}

function parseLinkHeader(header) {
    if (header.length === 0) throw new Error("input must not be of zero length");
    const parts = header.split(',');
    const links = _.reduce(parts, (acc, part) => {
        const section = part.split(';');
        if (section.length !== 2) throw new Error("section could not be split on ';'");
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const name = section[1].replace(/rel="(.*)"/, '$1').trim();
        acc[name] = url;
        return acc;
    }, {});
    return links;
}

function getOwnRepos(config) {
    let reqUrl = `https://api.github.com/user/repos?access_token=${config.accessToken}&page=1`;
    function getPage(sources, url) {
        return axios.get(url).then((res) => {
            const all = sources.concat(_.map(res.data, (item) => {
                const result = {};
                result.name = item.full_name;
                result.clone = (config.cloneUrl === 'ssh') ? item.ssh_url : item.clone_url;
                result.html = item.html_url;
                return result;
            }));
            if (res.headers.link) {
                let linkHeader = parseLinkHeader(res.headers.link);
                if (linkHeader.next) {
                    return getPage(all, linkHeader.next);
                }
            }
            return all;
        }).catch();
    }
    return getPage([], reqUrl);
}

function getReposFromUsernames(config) {
    return Promise.map(config.usernames, (username) => {
        let reqUrl = `https://api.github.com/users/${username}/repos`;
        function getPage(sources, url) {
            return axios.get(url).then((res) => {
                const all = sources.concat(_.map(res.data, (item) => {
                    const result = {};
                    result.name = item.full_name;
                    result.clone = (config.cloneUrl === 'ssh') ? item.ssh_url : item.clone_url;
                    result.html = item.html_url;
                    return result;
                }));
                if (res.headers.link) {
                    let linkHeader = parseLinkHeader(res.headers.link);
                    if (linkHeader.next) {
                        return getPage(all, linkHeader.next);
                    }
                }
                return all;
            });
        }
        return getPage([], reqUrl);
    }).reduce((sources, result) => {
        sources = sources.concat(result);
        return sources;
    }, []);
}
