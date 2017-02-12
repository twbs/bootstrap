module.exports = function (grunt) {
  return {
    all: {
      options: {
        build: process.env.TRAVIS_JOB_ID,
        concurrency: 10,
        maxRetries: 3,
        maxPollRetries: 4,
        urls: ['http://127.0.0.1:3000/js/tests/index.html?hidepassed'],
        browsers: grunt.file.readYAML('build/sauce_browsers.yml')
      }
    }
  }
}
