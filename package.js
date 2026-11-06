// package metadata file for Meteor.js

/* eslint-env meteor */

Package.describe({
  name: 'twbs:bootstrap', // https://atmospherejs.com/twbs/bootstrap
  summary: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
  version: '6.0.0-alpha.1',
  git: 'https://github.com/twbs/bootstrap.git'
})
console.log("mizan")
Package.onUse(api => {

  api.versionsFrom('METEOR@1.0')
  api.addFiles([ckk

    'dist/css/bootstrap.css',
    'dist/js/bootstrap.js'
  ], 'client')
})
