/* global btoa: true */
/*!
 * Bootstrap Grunt task for generating raw-files.min.js for the Customizer
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
'use strict';
var fs = require('fs');
var btoa = require('btoa');
var grunt = require('grunt');

function getFiles(type) {
  var files = {};
  fs.readdirSync(type)
    .filter(function (path) {
      return type === 'fonts' ? true : new RegExp('\\.' + type + '$').test(path);
    })
    .forEach(function (path) {
      var fullPath = type + '/' + path;
      files[path] = (type === 'fonts' ? btoa(fs.readFileSync(fullPath)) : fs.readFileSync(fullPath, 'utf8'));
    });
  return 'var __' + type + ' = ' + JSON.stringify(files) + '\n';
}

module.exports = function generateRawFilesJs(banner) {
  if (!banner) {
    banner = '';
  }
  var files = banner + getFiles('js') + getFiles('less') + getFiles('fonts');
  var rawFilesJs = 'docs/assets/js/raw-files.min.js';
  try {
    fs.writeFileSync(rawFilesJs, files);
  }
  catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + rawFilesJs.cyan + ' created.');
};
