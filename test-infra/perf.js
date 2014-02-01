module.exports = function(grunt) {
  grunt.registerMultiTask('gen_component_html', 'Generate files for testing', function() {
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
        component = $this.find('.page-header').first().children('h1'),
        fileName = component.attr('id'),
        code = [],
        html = ['<html><head>', head, '</head><body>'];
      $this.find('.bs-example').each(function(i, el) {
        code.push($(this).html());
      })
      files.push(fileName);
      componentNames.push(component.text());
      for (var j = 0; j < repeat; j++) {
        html.push(code.join('<br/>'), '<!-- Iteration:' + j + ' -->\n<br/>');
      }
      html.push('</body></html>')
      grunt.file.write(options.dest + '/' + fileName + '.html', html.join(''));
    });
  });


  grunt.registerMultiTask('perf', 'Run Performance test cases', function() {
    var options = this.options(),
      done = this.async(),
      path = require('path'),
      perfjankie = require('perfjankie'),
      SauceTunnel = require('sauce-tunnel'),
      files = this.filesSrc;

    grunt.verbose.writeln('Starting Saucelabs Tunnel');
    var tunnel = new SauceTunnel(options.SAUCE_USERNAME, options.SAUCE_ACCESS_KEY, 'tunnel', true);
    tunnel.start(function(status) {
      if (status === false) {
        grunt.log.fail('Could not open tunnel to saucelabs to testing');
      }
      grunt.verbose.writeln('Saucelabs Tunnel started');
      runPerfTest(0, function() {
        grunt.verbose.writeln('All perf tests completed');
        tunnel.stop(function() {
          done();
        });
      });
    });

    var runPerfTest = function(i, cb) {
      if (i < files.length) {
        grunt.verbose.writeln('Testing File ', files[i]);
        perfjankie({
          url: options.httpserver + files[i],
          name: path.relative('./tmp/', files[i]).replace(/.html/, ''),
          suite: options.suite,
          browsers: options.browsers,
          selenium: options.selenium,
          SAUCE_USERNAME: options.SAUCE_USERNAME,
          SAUCE_ACCESS_KEY: options.SAUCE_ACCESS_KEY,
          time: options.time,
          run: options.run,
          log: { // Expects the following methods,
            fatal: grunt.fail.fatal.bind(grunt.fail),
            error: grunt.fail.warn.bind(grunt.fail),
            warn: grunt.log.error.bind(grunt.log),
            info: grunt.log.ok.bind(grunt.log),
            debug: grunt.verbose.writeln.bind(grunt.verbose),
            trace: grunt.log.debug.bind(grunt.log)
          },
          couch: {
            server: options.couchdb.server,
            database: options.couchdb.database,
            updateSite: options.couchdb.updateSite
          },
          callback: function(err, res) {
            if (err) {
              grunt.log.warn(err);
            } else {
              grunt.verbose.ok(res);
            }
            runPerfTest(i + 1, cb);
          }
        });
      } else {
        cb();
      }
    };
  });
}