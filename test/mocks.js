'use strict';
const path = require('path');

exports.setupAnswers = {
    alias: 'bitcar',
    workspaceDir: path.normalize('./.bitcar-test'),
    drivers: [ 'github', 'bitbucket-server' ],
    githubUsernames: 'carsdotcom',
    bitbucketServerHost: 'git.cars.com'
};

exports.resultAnswers = {
    result: 'github.com/carsdotcom/bitcar'
};

exports.credentialsAnswers = {
    username: 'foo',
    password: 'bar'
};

exports.git = {
    clone: (url, dir, cb) => {
        return cb(null, {});
    },
    fetch: (options, cb) => {
        return cb(null, {});
    },
    reset: (options, cb) => {
        return cb(null, {});
    },
    clean: (mode, options, cb) => {
        return cb(null, {});
    }
};

exports.bitbucketServerResponse = {
    data: {
        values: []
    }
};

exports.githubResponse = {
    headers: {},
    data: []
};

exports.config = {
    alias: "bit",
    drivers: [
        {
            type: "github",
            host: "github.com",
            accessToken: "9eccdc79e394f713624486c0272f44fe67267b97"
        },
        {
            type: "bitbucket-server",
            host: "git.cars.com"
        }
    ]
};

exports.configWithUsernames = {
    alias: "bit",
    drivers: [
        {
            type: "github",
            host: "github.com",
            accessToken: "9eccdc79e394f713624486c0272f44fe67267b97",
            usernames: [ 'google' ]
        },
        {
            type: "bitbucket-server",
            host: "git.cars.com"
        }
    ]
};

exports.configWithoutGithub = {
    alias: "bit",
    drivers: [
        {
            type: "bitbucket-server",
            host: "git.cars.com"
        }
    ]
};

exports.configWithoutBitbucketServer = {
    alias: "bit",
    drivers: [
        {
            type: "github",
            host: "github.com",
            accessToken: "9eccdc79e394f713624486c0272f44fe67267b97"
        }
    ]
};

exports.open = function (url, cb) {
    cb(null);
};
