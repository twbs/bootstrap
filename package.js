// package metadata file for Meteor.js

/* eslint-env meteor */

Package.describe({
  name: 'twbs:bootstrap',  // https://atmospherejs.com/twbs/bootstrap
  summary: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
<<<<<<< HEAD
  version: '4.1.3',
||||||| merged common ancestors
  version: '3.3.5',
=======
  version: '3.4.0',
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
  git: 'https://github.com/twbs/bootstrap.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('jquery', 'client');
<<<<<<< HEAD
  api.addFiles([
||||||| merged common ancestors
  api.addFiles([
    'dist/fonts/glyphicons-halflings-regular.eot',
    'dist/fonts/glyphicons-halflings-regular.svg',
    'dist/fonts/glyphicons-halflings-regular.ttf',
    'dist/fonts/glyphicons-halflings-regular.woff',
    'dist/fonts/glyphicons-halflings-regular.woff2'
  ], 'client', { isAsset: true });
  api.addFiles([
=======
  var assets = [
    'dist/fonts/glyphicons-halflings-regular.eot',
    'dist/fonts/glyphicons-halflings-regular.svg',
    'dist/fonts/glyphicons-halflings-regular.ttf',
    'dist/fonts/glyphicons-halflings-regular.woff',
    'dist/fonts/glyphicons-halflings-regular.woff2'
  ];
  if (api.addAssets) {
    api.addAssets(assets, 'client');
  } else {
    api.addFiles(assets, 'client', { isAsset: true });
  }
  api.addFiles([
>>>>>>> 7aaabebdedb6cd1483ea6de37d84d578a131cfbc
    'dist/css/bootstrap.css',
    'dist/js/bootstrap.js'
  ], 'client');
});
