/* eslint-env node */
'use strict'

const path = require('node:path')
const ip = require('ip')
const { babel } = require('@rollup/plugin-babel')
const istanbul = require('rollup-plugin-istanbul')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const { browsers } = require('./browsers')

const ENV = process.env
const LAMBDATEST = Boolean(ENV.LAMBDATEST)
const BROWSERSTACK = Boolean(ENV.BROWSERSTACK)
const DEBUG = Boolean(ENV.DEBUG)
const JQUERY_TEST = Boolean(ENV.JQUERY)

const webdriverConfig = {
  hostname: 'hub.lambdatest.com',
  port: 80
}

const webdriverConfigMobile = {
  hostname: 'mobile-hub.lambdatest.com',
  port: 80
}

const frameworks = [
  'jasmine'
]

const plugins = [
  'karma-jasmine',
  'karma-rollup-preprocessor'
]

const reporters = ['dots']

const detectBrowsers = {
  usePhantomJS: false,
  postDetection(availableBrowser) {
    // On CI just use Chrome
    if (ENV.CI === true) {
      return ['ChromeHeadless']
    }

    if (availableBrowser.includes('Chrome')) {
      return DEBUG ? ['Chrome'] : ['ChromeHeadless']
    }

    if (availableBrowser.includes('Chromium')) {
      return DEBUG ? ['Chromium'] : ['ChromiumHeadless']
    }

    if (availableBrowser.includes('Firefox')) {
      return DEBUG ? ['Firefox'] : ['FirefoxHeadless']
    }

    throw new Error('Please install Chrome, Chromium or Firefox')
  }
}

const config = {
  basePath: '../..',
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true,
  captureTimeout: 90000,
  browserDisconnectTolerance: 3,
  browserDisconnectTimeout: 90000,
  browserNoActivityTimeout: 90000,
  concurrency: Number.POSITIVE_INFINITY,
  client: {
    clearContext: false
  },
  files: [
    'node_modules/hammer-simulator/index.js',
    {
      pattern: 'js/tests/unit/**/!(jquery).spec.js',
      watched: !BROWSERSTACK
    }
  ],
  preprocessors: {
    'js/tests/unit/**/*.spec.js': ['rollup']
  },
  rollupPreprocessor: {
    plugins: [
      replace({
        'process.env.NODE_ENV': '"dev"',
        preventAssignment: true
      }),
      istanbul({
        exclude: [
          'node_modules/**',
          'js/tests/unit/**/*.spec.js',
          'js/tests/helpers/**/*.js'
        ]
      }),
      babel({
        // Only transpile our source code
        exclude: 'node_modules/**',
        // Inline the required helpers in each file
        babelHelpers: 'inline'
      }),
      nodeResolve()
    ],
    output: {
      format: 'iife',
      name: 'bootstrapTest',
      sourcemap: 'inline',
      generatedCode: 'es2015'
    }
  }
}

if (LAMBDATEST) {
  config.hostname = 'localhost.lambdatest.com',
    Object.keys(browsers['lambdaTest']).map(key => {
      browsers['lambdaTest'][key].base = 'WebDriver'
      browsers['lambdaTest'][key].build = `bootstrap-${ENV.GITHUB_SHA ? `${ENV.GITHUB_SHA.slice(0, 7)}-` : ''}${new Date().toISOString()}`
      browsers['lambdaTest'][key].project = 'Bootstrap'
      if (browsers['lambdaTest'][key].isRealMobile) {
        browsers['lambdaTest'][key].config = webdriverConfigMobile
        browsers['lambdaTest'][key].user = ENV.LT_USERNAME
        browsers['lambdaTest'][key].accessKey = ENV.LT_ACCESS_KEY
        browsers['lambdaTest'][key].tunnel = true
        browsers['lambdaTest'][key].tunnelName = process.env.LT_TUNNEL_NAME || 'jasmine'
        browsers['lambdaTest'][key].pseudoActivityInterval = 15000 // 5000 ms heartbeat
      }
      else {
        browsers['lambdaTest'][key].config = webdriverConfig
        browsers['lambdaTest'][key]["LT:Options"].username = ENV.LT_USERNAME
        browsers['lambdaTest'][key]["LT:Options"].accessKey = ENV.LT_ACCESS_KEY
        browsers['lambdaTest'][key]["LT:Options"].tunnel = true
        browsers['lambdaTest'][key]["LT:Options"].tunnelName = process.env.LT_TUNNEL_NAME || 'jasmine'
        browsers['lambdaTest'][key]["LT:Options"].plugin = 'bootstrap-karma'
        browsers['lambdaTest'][key]["LT:Options"].pseudoActivityInterval = 15000 // 5000 ms heartbeat
      }
      browsers['lambdaTest'][key].retryLimit = 2
    })
  plugins.push('karma-webdriver-launcher', 'karma-jasmine', 'karma-jasmine-html-reporter')
  config.customLaunchers = browsers['lambdaTest']
  config.browsers = Object.keys(browsers['lambdaTest'])
  reporters.push('kjhtml')
} else if (BROWSERSTACK) {
  config.hostname = ip.address()
  config.browserStack = {
    username: ENV.BROWSER_STACK_USERNAME,
    accessKey: ENV.BROWSER_STACK_ACCESS_KEY,
    build: `bootstrap-${ENV.GITHUB_SHA ? `${ENV.GITHUB_SHA.slice(0, 7)}-` : ''}${new Date().toISOString()}`,
    project: 'Bootstrap',
    retryLimit: 2
  }
  plugins.push('karma-browserstack-launcher', 'karma-jasmine-html-reporter')
  config.customLaunchers = browsers['browserStack']
  config.browsers = Object.keys(browsers['browserStack'])
  reporters.push('BrowserStack', 'kjhtml')
} else if (JQUERY_TEST) {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers'
  )
  config.detectBrowsers = detectBrowsers
  config.files = [
    'node_modules/jquery/dist/jquery.slim.min.js',
    {
      pattern: 'js/tests/unit/jquery.spec.js',
      watched: false
    }
  ]
} else if (JQUERY_TEST) {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers'
  )
  config.detectBrowsers = detectBrowsers
  config.files = [
    'node_modules/jquery/dist/jquery.slim.min.js',
    {
      pattern: 'js/tests/unit/jquery.spec.js',
      watched: false
    }
  ]
} else {
  frameworks.push('detectBrowsers')
  plugins.push(
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-detect-browsers',
    'karma-coverage-istanbul-reporter'
  )
  reporters.push('coverage-istanbul')
  config.detectBrowsers = detectBrowsers
  config.coverageIstanbulReporter = {
    dir: path.resolve(__dirname, '../coverage/'),
    reports: ['lcov', 'text-summary'],
    thresholds: {
      emitWarning: false,
      global: {
        statements: 90,
        branches: 89,
        functions: 90,
        lines: 90
      }
    }
  }

  if (DEBUG) {
    config.hostname = ip.address()
    plugins.push('karma-jasmine-html-reporter')
    reporters.push('kjhtml')
    config.singleRun = false
    config.autoWatch = true
  }
}

config.frameworks = frameworks
config.plugins = plugins
config.reporters = reporters
module.exports = karmaConfig => {
  config.logLevel = karmaConfig.LOG_ERROR
  karmaConfig.set(config)
}
