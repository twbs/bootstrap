'use strict'

const browsers = {
  safariMac: {
    browserName: 'Safari',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'MacOS Monterey'
    }
  },
  chromeMac: {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'MacOS Monterey'
    }
  },
  firefoxMac: {
    browserName: 'Firefox',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'MacOS Monterey'
    }
  },
  chromeWin10: {
    browserName: 'Chrome',
    browserVersion: '60',
    'LT:Options': {
      platformName: 'Windows 10'
    }
  },
  firefoxWin10: {
    browserName: 'Firefox',
    browserVersion: '60',
    'LT:Options': {
      platformName: 'Windows 10'
    }
  },
  chromeWin10Latest: {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'Windows 10'
    }
  },
  firefoxWin10Latest: {
    browserName: 'Firefox',
    browserVersion: 'latest',
    'LT:Options': {
      platformName: 'Windows 10'
    }
  },
  iphone11: {
    platformName: 'ios',
    platformVersion: '15',
    browserName: 'Safari',
    deviceName: 'iPhone 13',
    isRealMobile: true
  },
  iphone14: {
    platformName: 'ios',
    platformVersion: '16',
    browserName: 'Safari',
    deviceName: 'iPhone 14',
    isRealMobile: true
  },
  pixel6: {
    platformName: 'android',
    platformVersion: '12',
    browserName: 'Chrome',
    deviceName: 'Pixel 6',
    isRealMobile: true
  }
}

module.exports = {
  browsers
}
