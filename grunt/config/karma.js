// https://github.com/karma-runner/grunt-karma
module.exports = {
  options: {
    configFile: 'karma.conf.js',
    runnerPort: 9999,
  },
  continuous: {
    singleRun: true,
    browsers: ['TinyPhantomJS', 'SmallPhantomJS']
  },
  dev: {
    singleRun: true,
    browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox'],
    reporters: 'dots'
  },
  dev_watch: {
    background: true,
    browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox']
  },
  mac: {
    singleRun: true,
    browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox', 'Safari'],
    reporters: 'dots'
  },
  win: {
    singleRun: true,
    browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox', 'IE'],
    reporters: 'dots'
  }
};