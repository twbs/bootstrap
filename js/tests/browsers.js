/* eslint-env node */
/* eslint-disable camelcase */

const browsers = {
  safariMac: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'Catalina',
    browser: 'Safari',
    browser_version: 'latest'
  },
  chromeMac: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'Catalina',
    browser: 'Chrome',
    browser_version: 'latest'
  },
  firefoxMac: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'Catalina',
    browser: 'Firefox',
    browser_version: 'latest'
  },
  chromeWin10: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'Chrome',
    browser_version: '60'
  },
  firefoxWin10: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'Firefox',
    browser_version: '60'
  },
  chromeWin10Latest: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'Chrome',
    browser_version: 'latest'
  },
  firefoxWin10Latest: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '10',
    browser: 'Firefox',
    browser_version: 'latest'
  },
  iphone7: {
    base: 'BrowserStack',
    os: 'ios',
    os_version: '12.0',
    device: 'iPhone 7',
    real_mobile: true
  },
  iphone12: {
    base: 'BrowserStack',
    os: 'ios',
    os_version: '14.0',
    device: 'iPhone 12',
    real_mobile: true
  },
  pixel2: {
    base: 'BrowserStack',
    os: 'android',
    os_version: '8.0',
    device: 'Google Pixel 2',
    real_mobile: true
  }
}

const browsersKeys = Object.keys(browsers)

module.exports = {
  browsers,
  browsersKeys
}
