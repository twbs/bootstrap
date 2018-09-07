// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

var browsers = {
  safariMac: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'Yosemite',
    browser: 'Safari',
    browser_version: '8.0'
  },
  chromeMac: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'Yosemite',
    browser : 'Chrome',
    browser_version : 'latest'
  },
  firefoxMac: {
    base: 'BrowserStack',
    os: 'OS X',
    os_version: 'Yosemite',
    browser: 'Firefox',
    browser_version: 'latest'
  },
  'ie11Win8.1': {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '8.1',
    browser: 'IE',
    browser_version: '11.0'
  },
  ie10Win8: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '8',
    browser: 'IE',
    browser_version: '10.0'
  },
  ie9Win7: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '7',
    browser: 'IE',
    browser_version: '9.0'
  },
  ie8Win7: {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '7',
    browser: 'IE',
    browser_version: '8.0'
  },
  'chromeWin8.1': {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '8.1',
    browser: 'Chrome',
    browser_version: 'latest'
  },
  'firefoxWin8.1': {
    base: 'BrowserStack',
    os: 'Windows',
    os_version: '8.1',
    browser: 'Firefox',
    browser_version: 'latest'
  },
  iphone6: {
    base: 'BrowserStack',
    os: 'ios',
    os_version: '11.2',
    device: 'iPhone 6',
    real_mobile: true
  },
  nexus5: {
    base: 'BrowserStack',
    os: 'android',
    os_version: '4.4',
    device: 'Google Nexus 5',
    real_mobile: true
  }
};

module.exports = {
  list: browsers,
  keys: Object.keys(browsers)
};
