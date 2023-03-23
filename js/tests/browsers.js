/* eslint-env node */
/* eslint-disable camelcase */

const browsers = {
  safariMac: {
    platform: 'macOS Catalina',
    browserName: 'Safari',
    browserVersion: 'latest'
  },
  chromeMac: {
    platform: 'macOS Catalina',
    browserName: 'Chrome',
    browserVersion: 'latest'
  },
  firefoxMac: {
    platform: 'macOS Catalina',
    browserName: 'Firefox',
    browserVersion: 'latest'
  },
  chromeWin10: {
    platform: 'Windows 10',
    browserName: 'Chrome',
    browserVersion: '60'
  },
  firefoxWin10: {
    platform: 'Windows 10',
    browserName: 'Firefox',
    browserVersion: '60'
  },
  chromeWin10Latest: {
    platform: 'Windows 10',
    browserName: 'Chrome',
    browserVersion: 'latest'
  },
  firefoxWin10Latest: {
    platform: 'Windows 10',
    browserName: 'Firefox',
    browserVersion: 'latest'
  },
  // iphone7: {
  //   platform: 'ios',
  //   platformVersion: '12.0',
  //   deviceName: 'iPhone 7',
  //   real_mobile: true
  // },
  // iphone12: {
  //   platform: 'ios',
  //   platformVersion: '14.0',
  //   deviceName: 'iPhone 12',
  //   real_mobile: true
  // },
  // pixel2: {
  //   platform: 'android',
  //   platformVersion: '8.0',
  //   deviceName: 'Google Pixel 2',
  //   real_mobile: true
  // }
}

module.exports = {
  browsers
}
