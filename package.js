// package metadata file for Meteor.js

Package.describe({
  name: "twbs:bootstrap", // https://atmospherejs.com/twbs/bootstrap
  summary:
    "The most popular front-end framework for developing responsive, mobile first projects on the web.",
  version: "4.5.2",
  git: "https://github.com/twbs/bootstrap.git",
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@1.9");
  api.use("jquery@3.0.0", "client");
  api.addFiles(["dist/css/bootstrap.css", "dist/js/bootstrap.js"], "client");
});
