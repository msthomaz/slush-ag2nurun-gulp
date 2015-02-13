/*
 * slush-ag2nurun-gulp
 * https://github.com/MatheusSThomaz/slush-ag2nurun-gulp
 *
 * Copyright (c) 2015, Matheus Thomaz
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer');

function format(string) {
    var username = string ? string.toLowerCase() : '';
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        appName: workingDirName,
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();

console.log([
    '',
    '',
    '     _    ____ ____  _   _                        ',
    '    / \\  / ___|___ \\| \\ | |_   _ _ __ _   _ _ __  ',
    '   / _ \\| |  _  __) |  \\| | | | | \'__\| \| \| \| \'_ \\ ',
    '  / ___ \\ |_| |/ __/| |\\  | |_| | |  | |_| | | | |',
    ' /_/   \\_\\____|_____|_| \\_|\\__,_|_|   \\__,_|_| |_|',
    '                                                  ',
    '',
    '            AG2Nurun Gulp Generator',
    '            I hope you enjoy it :)',
    '',
    '     - Matheus Thomaz | contato@msthomaz.com',
    '',
    ''
  ].join('\n'));

gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: 'AG2Nurun Tech Team'
    }, {
        type: 'list',
        name: 'selectPreprocessor',
        message: 'What preprocessor you want to use?',
        choices: [
                { name: 'less', value: 'less' },
                { name: 'sass', value: 'sass' },
                { name: 'sass with Foundation', value: 'sass-foundation' },
                { name: 'stylus', value: 'stylus' }
            ],
        default: 0
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/' + answers.selectPreprocessor + '/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
