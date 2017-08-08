/*!
 * Bootstrap's Gruntfile
 * https://getbootstrap.com
 * Copyright 2013-2017 The Bootstrap Authors
 * Copyright 2013-2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict'

  // Project configuration.
  grunt.initConfig({
    'saucelabs-qunit': {
      all: {
        options: {
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 10,
          maxRetries: 3,
          maxPollRetries: 4,
          urls: ['http://localhost:3000/js/tests/index.html?hidepassed'],
          browsers: grunt.file.readYAML('build/sauce_browsers.yml')
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-saucelabs')
}
