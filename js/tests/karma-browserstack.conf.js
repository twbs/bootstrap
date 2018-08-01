/* eslint-env node */
/* eslint no-process-env: 0 */
const ip = require('ip')
const {
  browsers,
  browsersKeys
} = require('./browsers')

module.exports = (config) => {
  config.set({
    hostname: ip.address(),
    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      build: `bootstrap-${new Date().toISOString()}`,
      project: 'Bootstrap',
      retryLimit: 2
    },
    basePath: '../..',
    frameworks: ['qunit', 'sinon'],
    plugins: [
      'karma-qunit',
      'karma-sinon',
      'karma-browserstack-launcher'
    ],
    // list of files / patterns to load in the browser
    files: [
      'site/docs/4.1/assets/js/vendor/jquery-slim.min.js',
      'site/docs/4.1/assets/js/vendor/popper.min.js',
      'js/coverage/dist/util.js',
      'js/coverage/dist/tooltip.js',
      'js/coverage/dist/!(util|index|tooltip).js', // include all of our js/dist files except util.js, index.js and tooltip.js
      'js/tests/unit/*.js'
    ],
    customLaunchers: browsers,
    browsers: browsersKeys,
    reporters: ['dots', 'BrowserStack'],
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
  })
}
