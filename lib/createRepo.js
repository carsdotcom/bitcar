'use strict';
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const output = require('./output');
const drivers = require('../drivers');

module.exports = createRepo;

function createRepo(searchTerm) {
    if (searchTerm.startsWith('github.com')) {
        return drivers.github.createRepo({
            name: searchTerm.split('/').pop()
        });
    } else {
        return Promise.reject('create only supports github.com');
    }
}
