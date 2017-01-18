/**
 * --------------------------------------------------------------------------
 * Bootstrap's Gruntfile
 * https://getbootstrap.com
 * Copyright 2013-2017 The Bootstrap Authors
 * Copyright 2013-2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

module.exports = function (grunt) {
  require('time-grunt')(grunt)
  require('load-grunt-config')(grunt, {
    configPath: require('path').join(process.cwd(), 'build/grunt'),
    jitGrunt: {
      staticMappings: {
        buildcontrol: 'grunt-build-control',
        'saucelabs-qunit': 'grunt-saucelabs'
      }
    },
    data: {
      path: grunt.file.readJSON('build/config/path.json'),
      pkg: grunt.file.readJSON('package.json'),
      stampConf: require('./build/config/stamp.js')
    }
  })
}
