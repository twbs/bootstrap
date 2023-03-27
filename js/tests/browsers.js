/* eslint-env node */
/* eslint-disable camelcase */

const browsers = {
  lambdaTest: {
    safariMac: {
      browserName: 'Safari',
      browserVersion: 'latest',
      "LT:Options": {
        "platformName": "MacOS Monterey"
      }
    },
    chromeMac: {
      browserName: 'Chrome',
      browserVersion: 'latest',
      "LT:Options": {
        "platformName": "MacOS Monterey"
      }
    },
    firefoxMac: {
      browserName: 'Firefox',
      browserVersion: 'latest',
      "LT:Options": {
        "platformName": "MacOS Monterey"
      }
    },
    chromeWin10: {
      browserName: 'Chrome',
      browserVersion: '60',
      "LT:Options": {
        "platformName": "Windows 10"
      }
    },
    firefoxWin10: {
      browserName: 'Firefox',
      browserVersion: '60',
      "LT:Options": {
        "platformName": "Windows 10"
      }
    },
    chromeWin10Latest: {
      browserName: 'Chrome',
      browserVersion: 'latest',
      "LT:Options": {
        "platformName": "Windows 10"
      }
    },
    firefoxWin10Latest: {
      browserName: 'Firefox',
      browserVersion: 'latest',
      "LT:Options": {
        "platformName": "Windows 10"
      }
    },
    iphone7: {
      platformName: 'ios',
      platformVersion: '12',
      browserName: 'Safari',
      deviceName: 'iPhone 7',
      isRealMobile: true
    },
    iphone12: {
      platformName: 'ios',
      platformVersion: '16',
      browserName: 'Safari',
      deviceName: 'iPhone 12',
      isRealMobile: true
    },
    pixel2: {
      platformName: 'android',
      platformVersion: '12',
      browserName: 'Chrome',
      deviceName: 'Google Pixel 6',
      isRealMobile: true
    }
  },
  browserStack: {
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
}

module.exports = {
  browsers
}
