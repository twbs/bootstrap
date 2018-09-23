// package metadata file for Meteor.js

/* eslint-env meteor */

Package.describe({
  name: 'twbs:bootstrap',  // https://atmospherejs.com/twbs/bootstrap
  summary: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
<<<<<<< HEAD
  version: '4.1.3',
=======
  version: '3.4.0',
>>>>>>> cee8e8653dc009b5d86af4a8e2ad3a5e0688ca4c
  git: 'https://github.com/twbs/bootstrap.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('jquery', 'client');
<<<<<<< HEAD
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
>>>>>>> cee8e8653dc009b5d86af4a8e2ad3a5e0688ca4c
  api.addFiles([
    'dist/css/bootstrap.css',
    'dist/js/bootstrap.js'
  ], 'client');
});
