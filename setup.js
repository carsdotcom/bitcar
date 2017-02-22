#!/usr/bin/env node
'use strict';
const fs = require('./lib/fs');
const path = require('path');
const inquirer = require('inquirer');
const os = require('os');
const chalk = require('chalk');

module.exports = setup;

function setup() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'alias',
            message: 'Enter the bash command name you would like to use for bitcar:',
            default: 'bit'
        },
        {
            type: 'input',
            name: 'workspaceDir',
            message: 'Enter a directory for the bitcar workspace:',
            default: path.normalize(process.env.HOME + '/repos')
        },
        {
            type: 'checkbox',
            name: 'drivers',
            message: 'Which services to use with bitcar:',
            choices: [
                {
                    name: 'GitHub',
                    value: 'github'
                },
                {
                    name: 'Bitbucket Server',
                    value: 'bitbucket-server'
                }
            ]

        },
        {
            type: 'confirm',
            name: 'addGithubPrivateAccess',
            message: 'Do you want to access your private repos on github?',
            default: true,
            when: (answers) => answers.drivers.indexOf('github') >= 0
        },
        {
            type: 'input',
            name: 'githubAccessToken',
            message: 'Please enter your github.com private access token (generate one at https://github.com/settings/tokens/new):',
            when: (answers) => answers.addGithubPrivateAccess
        },
        {
            type: 'confirm',
            name: 'addOtherGithubUsernames',
            message: 'Would you like to track public repos from specific Github users?',
            default: false,
            when: (answers) => answers.drivers.indexOf('github') >= 0
        },
        {
            type: 'input',
            name: 'githubUsernames',
            message: 'Please type the github usernames which you want bitcar to track (comma separated, no spaces):',
            when: (answers) => answers.addOtherGithubUsernames
        },
        {
            type: 'input',
            name: 'bitbucketServerHost',
            message: 'Please enter your Bitbucket Server domain (NOTE: there is no support for bitbucket.org at this time):',
            when: (answers) => answers.drivers.indexOf('bitbucket-server') >= 0
        }
    ]).then((answers) => {
        return new Promise((resolve, reject) => {
            const path = require('path');

            const profileContent = `
# begin bitcar
export BITCAR_WORKSPACE_DIR='${answers.workspaceDir}'
source $HOME/.bitcar/cli.sh
source $HOME/.bitcar/completions.sh
# end bitcar`;
            const configContent = {
                alias: answers.alias,
                drivers: []
            };

            if (answers.drivers.indexOf('github') >= 0) {
                let githubConfig = { type: 'github', host: 'github.com', accessToken: answers.githubAccessToken };
                if (answers.githubUsernames) {
                    githubConfig.usernames = answers.githubUsernames.split(',');
                }
                configContent.drivers.push(githubConfig);
            }

            if (answers.drivers.indexOf('bitbucket-server') >= 0) {
                configContent.drivers.push({ type: 'bitbucket-server', host: answers.bitbucketServerHost });
            }

            const mkdirp = require('mkdirp');
            mkdirp.sync(path.normalize(process.env.HOME + '/.bitcar'));
            fs.writeJSON(path.normalize(process.env.HOME + '/.bitcar/config'), configContent, null, 4);
            fs.copyTpl(path.normalize(__dirname + '/dotfiles/cli.sh'), path.normalize(process.env.HOME + '/.bitcar/cli.sh'), answers);
            fs.copyTpl(path.normalize(__dirname + '/dotfiles/completions.sh'), path.normalize(process.env.HOME + '/.bitcar/completions.sh'), answers);
            fs.copy(path.normalize(__dirname + '/dotfiles/strip_codes'), path.normalize(process.env.HOME + '/.bitcar/strip_codes'));

            const SHELL = process.env.SHELL;
            if (SHELL.match(/bash/)) {
                fs.copy(path.normalize(process.env.HOME + '/.bash_profile'), path.normalize(process.env.HOME + '/.bash_profile.bkup'));
                let profile = fs.read(path.normalize(process.env.HOME + '/.bash_profile'));
                let updatedProfile = cleanProfile(profile) + profileContent;
                fs.write(path.normalize(process.env.HOME + '/.bash_profile'), updatedProfile);
            } else if (SHELL.match(/zsh/)) {
                fs.copy(path.normalize(process.env.HOME + '/.zshrc'), path.normalize(process.env.HOME + '/.zshrc.bkup'));
                let profile = fs.read(path.normalize(process.env.HOME + '/.zshrc'));
                let updatedProfile = cleanProfile(profile) + profileContent;
                fs.write(path.normalize(process.env.HOME + '/.zshrc'), updatedProfile);
            } else {
                console.log('unsupported shell');
                process.exit(1);
            }

            return fs.commit(function (err) {
                if (err) return reject(err);
                console.log('');
                console.log('Bitcar setup was successful!');
                console.log('');
                console.log(chalk.bold.inverse('Enter `. ~/.bash_profile` and hit enter, or start a new terminal for changes to take effect.'));
                console.log('');
                console.log(chalk.underline('Please note you MUST use the command name you chose during setup (`' + answers.alias + '`) for the tool to work.'));
                console.log(chalk.underline('Except for the setup command, DO NOT use the `bitcar` command directly'));
                return resolve();
            });
        });
    });
}

function cleanProfile(profile) {
    return profile.replace(/\n# begin bitcar[\s\S]+# end bitcar/gm, '');
}
