'use strict';

var ip = require('ip');
var browserConfig = require('./browsers');
var browserStack = process.env.BROWSER === 'true';

module.exports = function (config) {
  var conf = {
    basePath: '../',
    frameworks: ['qunit'],
    plugins: ['karma-qunit'],
    // list of files / patterns to load in the browser
    files: [
      'js/tests/vendor/jquery.min.js',
      'js/tooltip.js',
      'js/!(tooltip).js',
      'js/tests/unit/*.js'
    ],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR || config.LOG_WARN,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
    client: {
      qunit: {
        showUI: true
      }
    }
  };

  if (browserStack) {
    conf.hostname = ip.address();
    conf.browserStack = {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      build: 'bootstrap-v3-' + new Date().toISOString(),
      project: 'Bootstrap v3',
      retryLimit: 1
    };
    conf.plugins.push('karma-browserstack-launcher');
    conf.customLaunchers = browserConfig.list;
    conf.browsers = browserConfig.keys;
    conf.reporters.push('BrowserStack');
  } else {
    conf.frameworks.push('detectBrowsers');
    conf.plugins.push(
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-detect-browsers'
    );

    conf.detectBrowsers = {
      usePhantomJS: false,
      postDetection: function (availableBrowser) {
        if (typeof process.env.TRAVIS_JOB_ID !== 'undefined' || availableBrowser.includes('Chrome')) {
          return ['ChromeHeadless'];
        }

        if (availableBrowser.includes('Firefox')) {
          return ['FirefoxHeadless'];
        }

        throw new Error('Please install Firefox or Chrome');
      }
    };

    conf.customLaunchers = {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    };
  }

  config.set(conf);
};
