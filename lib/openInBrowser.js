'use strict';
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const browser = require('./browser');

module.exports = openInBrowser;

function openInBrowser(sourceResult) {
    return Promise.promisify(browser.open, { context: browser })(sourceResult.html)
        .then(() => sourceResult);
}
