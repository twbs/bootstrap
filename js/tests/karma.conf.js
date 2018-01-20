/* eslint-env node */
/* eslint no-process-env: 0 */

module.exports = (config) => {
  const jqueryFile = process.env.USE_OLD_JQUERY ? 'js/tests/vendor/jquery-1.9.1.min.js' : 'assets/js/vendor/jquery-slim.min.js'

  config.set({
    basePath: '../..',
    frameworks: ['qunit', 'detectBrowsers'],
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-qunit',
      'karma-detect-browsers'
    ],
    // list of files / patterns to load in the browser
    files: [
      jqueryFile,
      'assets/js/vendor/popper.min.js',
      'js/dist/util.js',
      'js/dist/tooltip.js',
      'js/dist/!(util|index|tooltip).js', // include all of our js/dist files except util.js, index.js and tooltip.js
      'js/tests/unit/*.js'
    ],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR || config.LOG_WARN,
    autoWatch: false,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },
    singleRun: true,
    concurrency: Infinity,
    detectBrowsers: {
      usePhantomJS: false,
      postDetection(availableBrowser) {
        if (typeof process.env.TRAVIS_JOB_ID !== 'undefined' || availableBrowser.includes('Chrome')) {
          return ['ChromeHeadless']
        }

        if (availableBrowser.includes('Firefox')) {
          return ['FirefoxHeadless']
        }

        throw new Error('Please install Firefox or Chrome')
      }
    }
  })
}
