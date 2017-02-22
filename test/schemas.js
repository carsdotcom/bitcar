'use strict';

const Joi = require('joi');

exports.setupPrompt = Joi.array().items(Joi.object({
    type: Joi.string().required(),
    name: Joi.string().valid(['alias', 'workspaceDir', 'addGithub', 'githubUsernames', 'addBitbucketServer', 'bitbucketHost']).required(),
    message: Joi.string().required(),
    default: Joi.any().optional()
}));

exports.resultsPrompt = Joi.array().items(Joi.object({
    type: Joi.string().required(),
    name: Joi.string().valid('result').required(),
    message: Joi.string().required(),
    choices: Joi.array().items(Joi.string().optional())
}));

exports.result = Joi.object().keys({
    name: Joi.string().required(),
    clone: Joi.string().required(),
    html: Joi.string().required(),
    repoDir: Joi.string().required()
});
