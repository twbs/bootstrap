module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('perfjankie');

  var commitDate = [];

  /* Configuration for generating component HTML*/
  grunt.config('genComponentHtml', {
    perf: {
      options: {
        repeat: 100,
        dest: './docs/tmp'
      }
    }
  });

  /* Perfjankie configuration */
  grunt.config('perfjankie', {
    options: {
      suite: 'Bootstrap - Performance Analysis',
      urls: grunt.file.expand('docs/tmp/*.html').map(function(file) {
        return 'http://localhost:3000/' + file;
      }),
      time: commitDate,
      run: process.env.TRAVIS_COMMIT
    },
    travis: {
      options: {
        selenium: 'ondemand.saucelabs.com',
        SAUCE_USERNAME: process.env.SAUCE_USERNAME,
        SAUCE_ACCESSKEY: process.env.SAUCE_ACCESS_KEY,
        sauceTunnel: 'tunnel',
        browsers: [{
          browserName: 'chrome',
          platform: 'Windows 8.1',
          version: 33,
          'tunnel-identifier': 'tunnel',
          build: process.env.TRAVIS_COMMIT,
          name: 'bootstrap-perf'
        }],
        couch: {
          server: 'http://' + process.env.COUCH_USERNAME + ':' + process.env.COUCH_PASSWORD + '@bootstrap.iriscouch.com:5984',
          database: 'perf',
          updateSite: false
        }
      }
    }
  });

  grunt.registerMultiTask('genComponentHtml', 'Generate files for testing', function() {
    var done = this.async();
    var components = grunt.file.read('./_gh_pages/components/index.html', 'utf-8');
    if (!components) {
      grunt.log.fail('Could not read components file. Ensure that grunt docs task has been run');
      return;
    }

    var cheerio = require('cheerio'),
      options = this.options(),
      $ = cheerio.load(components),
      head = $('head').html(),
      repeat = options.repeat || 1,
      files = [],
      componentNames = [];

    $('.bs-docs-section:has(.bs-example)').each(function(i, el) {
      var $this = $(this),
        component = $this.find('h1.page-header'),
        fileName = component.attr('id'),
        code = [],
        html = ['<html><head>', head, '</head><body>'];
      $this.find('.bs-example').each(function(i, el) {
        code.push($(this).html());
      });
      files.push(fileName);
      componentNames.push(component.text());
      for (var j = 0; j < repeat; j++) {
        html.push(code.join('<br/>'), '<!-- Iteration:' + j + ' -->\n<br/>');
      }
      html.push('</body></html>');
      grunt.log.writeln('Generating ', fileName);
      grunt.file.write(options.dest + '/' + fileName + '.html', html.join(''));
    });

    // Getting the current commit date
    require('child_process').exec('git show -s --format=%ct', function(err, stdout, stderr) {
      commitDate.push(stdout);
      done();
    });
  });

  grunt.registerTask('perf', ['clean:perf', 'jekyll:docs', 'genComponentHtml:perf', 'connect', 'perfjankie:travis']);
};
