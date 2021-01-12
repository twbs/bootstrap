/* eslint-env node */

'use strict'

const path = require('path')
const ip = require('ip')
const { browsers, browsersKeys } = require('./browsers')

const USE_OLD_JQUERY = Boolean(process.env.USE_OLD_JQUERY)
const BUNDLE = Boolean(process.env.BUNDLE)
const BROWSERSTACK = Boolean(process.env.BROWSERSTACK)
const JQUERY_FILE = USE_OLD_JQUERY ? 'https://code.jquery.com/jquery-1.9.1.min.js' : 'node_modules/jquery/dist/jquery.slim.min.js'

const frameworks = [
  'qunit',
  'sinon'
]

const plugins = [
  'karma-qunit',
  'karma-sinon'
]

const reporters = ['dots']

const detectBrowsers = {
  usePhantomJS: false,
  postDetection(availableBrowser) {
    if (process.env.CI === true || availableBrowser.includes('Chrome')) {
      return ['ChromeHeadless']
    }

    if (availableBrowser.includes('Chromium')) {
      return ['ChromiumHeadless']
    }

    if (availableBrowser.includes('Firefox')) {
      return ['FirefoxHeadless']
    }

    throw new Error('Please install Chrome, Chromium or Firefox')
  }
}

const customLaunchers = {
  FirefoxHeadless: {
    base: 'Firefox',
    flags: ['-headless']
  }
}

let files = [
  'node_modules/popper.js/dist/umd/popper.min.js',
  'node_modules/hammer-simulator/index.js'
]

const conf = {
  basePath: '../..',
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true,
  concurrency: Infinity,
  client: {
    qunit: {
      showUI: true
    }
  }
}

if (BUNDLE) {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers'
  )
  conf.customLaunchers = customLaunchers
  conf.detectBrowsers = detectBrowsers
  files = files.concat([
    JQUERY_FILE,
    'dist/js/bootstrap.js'
  ])
} else if (BROWSERSTACK) {
  conf.hostname = ip.address()
  conf.browserStack = {
    username: process.env.BROWSER_STACK_USERNAME,
    accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
    build: `bootstrap-v4-${new Date().toISOString()}`,
    project: 'Bootstrap',
    retryLimit: 2
  }
  plugins.push('karma-browserstack-launcher')
  conf.customLaunchers = browsers
  conf.browsers = browsersKeys
  reporters.push('BrowserStack')
  files = files.concat([
    'node_modules/jquery/dist/jquery.slim.min.js',
    'js/dist/util.js',
    'js/dist/tooltip.js',
    // include all of our js/dist files except util.js, index.js and tooltip.js
    'js/dist/!(util|index|tooltip).js'
  ])
} else {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers'
  )
  files = files.concat([
    JQUERY_FILE,
    'js/coverage/dist/util.js',
    'js/coverage/dist/tooltip.js',
    // include all of our js/dist files except util.js, index.js and tooltip.js
    'js/coverage/dist/!(util|index|tooltip).js'
  ])
  conf.customLaunchers = customLaunchers
  conf.detectBrowsers = detectBrowsers
  if (!USE_OLD_JQUERY) {
    plugins.push('karma-coverage-istanbul-reporter')
    reporters.push('coverage-istanbul')
    conf.coverageIstanbulReporter = {
      dir: path.resolve(__dirname, '../coverage/'),
      reports: ['lcov', 'text-summary'],
      thresholds: {
        emitWarning: false,
        global: {
          statements: 90,
          branches: 86,
          functions: 89,
          lines: 90
        }
      }
    }
  }
}

files.push('js/tests/unit/*.js')

conf.frameworks = frameworks
conf.plugins = plugins
conf.reporters = reporters
conf.files = files

module.exports = karmaConfig => {
  conf.logLevel = karmaConfig.LOG_ERROR
  karmaConfig.set(conf)
}
