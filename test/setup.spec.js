'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const setup = require('../setup');
const fs = require('../lib/fs');
const inquirer = require('inquirer');
const path = require('path');
const _ = require('lodash');
const output = require('../lib/output');

const CONFIG_PATH = path.normalize(process.env.HOME + '/.bitcar/config');

describe('the bitcar setup script', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(fs, 'commit', (cb) => cb());
        sandbox.stub(output, 'log');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('when only github is selected', () => {
        beforeEach(() => {
            sandbox.stub(inquirer, 'prompt', (options) => {
                let answers = {
                    alias: 'bitcar',
                    workspaceDir: path.normalize('./.bitcar-test'),
                    drivers: [ 'github' ],
                    githubUsernames: 'carsdotcom'
                };
                return Promise.resolve(answers);
            });
        });

        it('should add github to config', () => {
            return setup().then(() => {
                let config = fs.readJSON(CONFIG_PATH);
                expect(config.drivers.length).to.equal(1);
                let githubDriver = _.find(config.drivers, { type: 'github' });
                expect(githubDriver).to.be.an('object');
                expect(githubDriver.type).to.equal('github');
                expect(githubDriver.host).to.equal('github.com');
            });
        });
    });

    describe('when only bitbucket server is selected', () => {
        beforeEach(() => {
            sandbox.stub(inquirer, 'prompt', (options) => {
                let answers = {
                    alias: 'bitcar',
                    workspaceDir: path.normalize('./.bitcar-test'),
                    drivers: [ 'bitbucket-server' ],
                    bitbucketServerHost: 'git.cars.com'
                };
                return Promise.resolve(answers);
            });
        });

        it('should add bitbucket server to config', () => {
            return setup().then(() => {
                let config = fs.readJSON(CONFIG_PATH);
                expect(config.drivers.length).to.equal(1);
                let githubDriver = _.find(config.drivers, { type: 'bitbucket-server' });
                expect(githubDriver).to.be.an('object');
                expect(githubDriver.type).to.equal('bitbucket-server');
                expect(githubDriver.host).to.equal('git.cars.com');
            });
        });
    });

});
