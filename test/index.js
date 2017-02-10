'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const cli = require('../cli');
const fs = require('../lib/fs');
const inquirer = require('inquirer');
const path = require('path');

// store cache fixture in mem-fs
fs.writeJSON(path.normalize(__dirname + '/../sources/.cache.json'), require('./fixtures/cache.json'), null, 4);

const schemas = require('./schemas');
const mocks = require('./mocks');


describe('the bitcar cli', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('search term is given but no other flags are provided', () => {
        beforeEach(() => {
            sinon.stub(fs, 'commit');
            sinon.stub(inquirer, 'prompt', (options) => {
                const setupPromptValidation = schemas.setupPrompt.validate(options);
                if (!setupPromptValidation.error) return Promise.resolve(mocks.setupAnswers);
                const resultsPromptValidation = schemas.resultsPrompt.validate(options);
                if (!resultsPromptValidation.error) return Promise.resolve(mocks.resultAnswers);
                return Promise.reject();
            });
        });
        it('should look for the search term in the cache', () => {
            return cli({ _: [ 'bitcar' ] })
                .then((result) => {
                    const resultValidation = schemas.result.validate(result);
                    expect(resultValidation.error).to.be.a('null');
                });
        });
    });
});

