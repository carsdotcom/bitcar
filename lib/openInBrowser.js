'use strict';
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const workspaceDir = require('./workspaceDir');
const browser = require('./browser');

module.exports = openInBrowser;

function openInBrowser(sourceResult) {
    return new Promise((resolve, reject) => {
        return browser.open(sourceResult.html, function (err) {
            if (err) return reject(err);
            return resolve(sourceResult);
        });
    });
}
