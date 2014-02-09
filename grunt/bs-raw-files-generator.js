/* global btoa: true */

/*!
 * Bootstrap Grunt task for generating raw-files.min.js for the Customizer
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

var btoa = require('btoa')
var fs = require('fs')

function getFiles(type) {
  var files = {}
  fs.readdirSync(type)
    .filter(function (path) {
      return type == 'fonts' ? true : new RegExp('\\.' + type + '$').test(path)
    })
    .forEach(function (path) {
      var fullPath = type + '/' + path
      return files[path] = (type == 'fonts' ? btoa(fs.readFileSync(fullPath)) : fs.readFileSync(fullPath, 'utf8'))
    })
  return 'var __' + type + ' = ' + JSON.stringify(files) + '\n'
}

module.exports = function generateRawFilesJs(banner) {
  if (!banner) {
    banner = ''
  }
  var files = banner + getFiles('js') + getFiles('less') + getFiles('fonts')
  fs.writeFileSync('docs/assets/js/raw-files.min.js', files)
}
