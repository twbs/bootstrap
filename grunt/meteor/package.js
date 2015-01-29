// package metadata file for Meteor.js
'use strict'

var packageName = 'twbs:bootstrap'  // http://atmospherejs.com/twbs/bootstrap
var where = 'client'  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'))

Package.describe({
  name: packageName,
  summary: 'Bootstrap (official): the most popular HTML/CSS/JS framework for responsive, mobile first projects',  // limited to 100 characters
  version: packageJson.version,
  git: 'https://github.com/twbs/bootstrap.git',
  documentation: 'grunt/meteor/README.md'
})

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0'])
  api.use('jquery')  // required by Bootstrap's JavaScript
  api.addFiles([
    // we bundle all font files, but the client will request only one of them via the CSS @font-face rule
    'dist/fonts/glyphicons-halflings-regular.eot',   // IE8 or older
    'dist/fonts/glyphicons-halflings-regular.svg',   // SVG fallback for iOS < 5 - http://caniuse.com/#feat=svg-fonts, http://stackoverflow.com/a/11002874/1269037
    'dist/fonts/glyphicons-halflings-regular.ttf',   // Android Browers 4.1, 4.3 - http://caniuse.com/#feat=ttf
    'dist/fonts/glyphicons-halflings-regular.woff',  // Supported by all modern browsers
    'dist/fonts/glyphicons-halflings-regular.woff2', // Most modern font format
    'dist/css/bootstrap.css',
    'dist/js/bootstrap.js',
    'grunt/meteor/init.js'
  ], where)
})

Package.onTest(function (api) {
  api.use(packageName, where)
  api.use(['tinytest', 'http'], where)

  api.addFiles('grunt/meteor/test.js', where)
})
