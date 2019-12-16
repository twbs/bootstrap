/* eslint-env node */
/* eslint no-process-env: 0 */

const path = require('path')
const ip = require('ip')
const {
  browsers,
  browsersKeys
} = require('./browsers')

const { env } = process
const bundle = env.BUNDLE === 'true'
const browserStack = env.BROWSER === 'true'
const debug = env.DEBUG === 'true'

const jqueryFile = 'node_modules/jquery/dist/jquery.slim.min.js'

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
    if (env.CI === true || availableBrowser.includes('Chrome')) {
      return debug ? ['Chrome'] : ['ChromeHeadless']
    }

    if (availableBrowser.includes('Firefox')) {
      return debug ? ['Firefox'] : ['FirefoxHeadless']
    }

    throw new Error('Please install Firefox or Chrome')
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

if (bundle) {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers'
  )
  conf.customLaunchers = customLaunchers
  conf.detectBrowsers = detectBrowsers
  files = files.concat([
    jqueryFile,
    'js/tests/unit/tests-polyfills.js',
    'dist/js/bootstrap.js',
    'js/tests/unit/!(tests-polyfills).js'
  ])
} else if (browserStack) {
  conf.hostname = ip.address()
  conf.browserStack = {
    username: env.BROWSER_STACK_USERNAME,
    accessKey: env.BROWSER_STACK_ACCESS_KEY,
    build: `bootstrap-${new Date().toISOString()}`,
    project: 'Bootstrap',
    retryLimit: 2
  }
  plugins.push('karma-browserstack-launcher')
  conf.customLaunchers = browsers
  conf.browsers = browsersKeys
  reporters.push('BrowserStack')
  files = files.concat([
    jqueryFile,
    'js/tests/unit/tests-polyfills.js',
    'js/coverage/dist/util/index.js',
    'js/coverage/dist/util/sanitizer.js',
    'js/coverage/dist/dom/polyfill.js',
    'js/coverage/dist/dom/event-handler.js',
    'js/coverage/dist/dom/selector-engine.js',
    'js/coverage/dist/dom/data.js',
    'js/coverage/dist/dom/manipulator.js',
    'js/coverage/dist/dom/!(polyfill).js',
    'js/coverage/dist/tooltip.js',
    'js/coverage/dist/!(util|index|tooltip).js', // include all of our js/dist files except util.js, index.js and tooltip.js
    'js/tests/unit/!(tests-polyfills).js',
    'js/tests/unit/dom/*.js',
    'js/tests/unit/util/*.js'
  ])
} else {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers',
    'karma-coverage-istanbul-reporter'
  )
  files = files.concat([
    jqueryFile,
    'js/tests/unit/tests-polyfills.js',
    'js/coverage/dist/util/index.js',
    'js/coverage/dist/util/sanitizer.js',
    'js/coverage/dist/dom/polyfill.js',
    'js/coverage/dist/dom/event-handler.js',
    'js/coverage/dist/dom/selector-engine.js',
    'js/coverage/dist/dom/data.js',
    'js/coverage/dist/dom/manipulator.js',
    'js/coverage/dist/dom/!(polyfill).js',
    'js/coverage/dist/tooltip.js',
    'js/coverage/dist/!(util|index|tooltip).js', // include all of our js/dist files except util.js, index.js and tooltip.js
    'js/tests/unit/!(tests-polyfills).js',
    'js/tests/unit/dom/*.js',
    'js/tests/unit/util/*.js'
  ])
  reporters.push('coverage-istanbul')
  conf.customLaunchers = customLaunchers
  conf.detectBrowsers = detectBrowsers
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
      },
      each: {
        overrides: {
          'js/src/dom/polyfill.js': {
            statements: 39,
            lines: 37,
            branches: 19,
            functions: 50
          }
        }
      }
    }
  }

  if (debug) {
    conf.singleRun = false
    conf.autoWatch = true
  }
}

conf.frameworks = frameworks
conf.plugins = plugins
conf.reporters = reporters
conf.files = files

module.exports = karmaConfig => {
  // possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
  conf.logLevel = karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN
  karmaConfig.set(conf)
}
