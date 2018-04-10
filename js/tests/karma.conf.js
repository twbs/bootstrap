/* eslint-env node */
/* eslint no-process-env: 0 */
const path = require('path')
const jsCoveragePath = path.resolve(__dirname, '../coverage')

module.exports = (config) => {
  const jqueryFile = process.env.USE_OLD_JQUERY ? 'https://code.jquery.com/jquery-1.9.1.min.js' : 'assets/js/vendor/jquery-slim.min.js'

  config.set({
    basePath: '../..',
    frameworks: ['qunit', 'sinon', 'detectBrowsers'],
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-qunit',
      'karma-sinon',
      'karma-detect-browsers',
      'karma-coverage-istanbul-reporter'
    ],
    // list of files / patterns to load in the browser
    files: [
      jqueryFile,
      'assets/js/vendor/popper.min.js',
      'js/coverage/dist/util.js',
      'js/coverage/dist/tooltip.js',
      'js/coverage/dist/!(util|index|tooltip).js', // include all of our js/dist files except util.js, index.js and tooltip.js
      'js/tests/unit/*.js'
    ],
    reporters: ['dots', 'coverage-istanbul'],
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
    },
    coverageIstanbulReporter: {
      dir: jsCoveragePath,
      reports: ['lcov', 'text-summary'],
      thresholds: {
        emitWarning: false,
        global: {
          statements: 89,
          lines: 89,
          branches: 83,
          functions: 84
        }
      }
    }
  })
}
