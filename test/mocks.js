'use strict';
const path = require('path');

exports.setupAnswers = {
    alias: 'bitcar',
    workspaceDir: path.normalize('./.bitcar-test'),
    drivers: [ 'github', 'bitbucket-server' ],
    githubUsernames: [ 'carsdotcom' ],
    bitbucketServerHost: 'git.cars.com'
};

exports.resultAnswers = {
    result: 'github.com/carsdotcom/bitcar'
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

exports.open = function (url, cb) {
    cb(null);
};
