#!/usr/bin/env node

'use strict';

/*!
 * Script to generate SRI hashes for use in our docs.
 * Remember to use the same vendor files as the CDN ones,
 * otherwise the hashes won't match!
 *
 * Copyright 2017-2019 The Bootstrap Authors
 * Copyright 2017-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var replace = require('replace-in-file');

var configFile = path.join(__dirname, '../_config.yml');

// Array of objects which holds the files to generate SRI hashes for.
// `file` is the path from the root folder
// `configPropertyName` is the _config.yml variable's name of the file
var files = [
  {
    file: 'dist/css/bootstrap.min.css',
    configPropertyName: 'css_hash'
  },
  {
    file: 'dist/css/bootstrap-theme.min.css',
    configPropertyName: 'css_theme_hash'
  },
  {
    file: 'dist/js/bootstrap.min.js',
    configPropertyName: 'js_hash'
  }
];

files.forEach(function (file) {
  fs.readFile(file.file, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    var algo = 'sha384';
    var hash = crypto.createHash(algo).update(data, 'utf8').digest('base64');
    var integrity = algo + '-' + hash;

    console.log(file.configPropertyName + ': ' + integrity);

    try {
      replace.sync({
        files: configFile,
        from: new RegExp('(\\s' + file.configPropertyName + ':\\s+"|\')(\\S+)("|\')'),
        to: '$1' + integrity + '$3'
      });
    } catch (error) {
      console.error('Error occurred:', error);
    }
  });
});
