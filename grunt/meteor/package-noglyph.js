// package metadata file for Meteor.js
'use strict'

var packageName = 'twbs:bootstrap-noglyph'  // http://atmospherejs.com/twbs/bootstrap-noglyph
var where = 'client'  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'))

Package.describe({
  name: packageName,
  summary: 'Bootstrap without the Glyphicons font (official): the most popular HTML/CSS/JS responsive framework',  // limited to 100 characters
  version: packageJson.version,
  git: 'https://github.com/twbs/bootstrap.git',
  readme: 'https://github.com/MeteorPackaging/bootstrap/blob/meteor-integration/grunt/meteor/README.md'
})

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0'])
  api.use('jquery')  // required by Bootstrap's JavaScript
  api.addFiles([
    'dist/css/bootstrap.css',
    'dist/js/bootstrap.js'
  ], where)
})

Package.onTest(function (api) {
  api.use(packageName, where)
  api.use(['tinytest', 'http'], where)

  api.addFiles('grunt/meteor/test-noglyph.js', where)
})
