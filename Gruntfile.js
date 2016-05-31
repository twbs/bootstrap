/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2016 The Bootstrap Authors
 * Copyright 2013-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var isTravis = require('is-travis');
  var mq4HoverShim = require('mq4-hover-shim');
  var autoprefixerSettings = require('./grunt/autoprefixer-settings.js');
  var autoprefixer = require('autoprefixer')(autoprefixerSettings);

  var generateCommonJSModule = require('./grunt/bs-commonjs-generator.js');
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });

  Object.keys(configBridge.paths).forEach(function (key) {
    configBridge.paths[key].forEach(function (val, i, arr) {
      arr[i] = path.join('./docs/assets', val);
    });
  });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n' +
            ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') {\n' +
                 '  throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery\')\n' +
                 '}\n',
    jqueryVersionCheck: '+function ($) {\n' +
                        '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n' +
                        '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 3)) {\n' +
                        '    throw new Error(\'Bootstrap\\\'s JavaScript requires at least jQuery v1.9.1 but less than v3.0.0\')\n' +
                        '  }\n' +
                        '}(jQuery);\n\n',

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    // JS build configuration
    babel: {
      dev: {
        options: {
          sourceMap: true,
          modules: 'ignore'
        },
        files: {
          'js/dist/util.js'      : 'js/src/util.js',
          'js/dist/alert.js'     : 'js/src/alert.js',
          'js/dist/button.js'    : 'js/src/button.js',
          'js/dist/carousel.js'  : 'js/src/carousel.js',
          'js/dist/collapse.js'  : 'js/src/collapse.js',
          'js/dist/dropdown.js'  : 'js/src/dropdown.js',
          'js/dist/modal.js'     : 'js/src/modal.js',
          'js/dist/scrollspy.js' : 'js/src/scrollspy.js',
          'js/dist/tab.js'       : 'js/src/tab.js',
          'js/dist/tooltip.js'   : 'js/src/tooltip.js',
          'js/dist/popover.js'   : 'js/src/popover.js'
        }
      },
      dist: {
        options: {
          modules: 'ignore'
        },
        files: {
          '<%= concat.bootstrap.dest %>' : '<%= concat.bootstrap.dest %>'
        }
      },
      umd: {
        options: {
          modules: 'umd'
        },
        files: {
          'dist/js/umd/util.js'      : 'js/src/util.js',
          'dist/js/umd/alert.js'     : 'js/src/alert.js',
          'dist/js/umd/button.js'    : 'js/src/button.js',
          'dist/js/umd/carousel.js'  : 'js/src/carousel.js',
          'dist/js/umd/collapse.js'  : 'js/src/collapse.js',
          'dist/js/umd/dropdown.js'  : 'js/src/dropdown.js',
          'dist/js/umd/modal.js'     : 'js/src/modal.js',
          'dist/js/umd/scrollspy.js' : 'js/src/scrollspy.js',
          'dist/js/umd/tab.js'       : 'js/src/tab.js',
          'dist/js/umd/tooltip.js'   : 'js/src/tooltip.js',
          'dist/js/umd/popover.js'   : 'js/src/popover.js'
        }
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      core: {
        src: 'js/src/*.js'
      },
      test: {
        src: 'js/tests/unit/*.js'
      },
      assets: {
        options: {
          requireCamelCaseOrUpperCaseIdentifiers: null
        },
        src: ['docs/assets/js/src/*.js', 'docs/assets/js/*.js', '!docs/assets/js/*.min.js']
      }
    },

    stamp: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>\n+function ($) {\n',
        footer: '\n}(jQuery);'
      },
      bootstrap: {
        files: {
          src: '<%= concat.bootstrap.dest %>'
        }
      }
    },

    concat: {
      options: {
        // Custom function to remove all export and import statements
        process: function (src) {
          return src.replace(/^(export|import).*/gm, '');
        },
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/src/util.js',
          'js/src/alert.js',
          'js/src/button.js',
          'js/src/carousel.js',
          'js/src/collapse.js',
          'js/src/dropdown.js',
          'js/src/modal.js',
          'js/src/scrollspy.js',
          'js/src/tab.js',
          'js/src/tooltip.js',
          'js/src/popover.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      core: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      docsJs: {
        src: configBridge.paths.docsJs,
        dest: 'docs/assets/js/docs.min.js'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    },

    // CSS build configuration
    scsslint: {
      options: {
        bundleExec: true,
        config: 'scss/.scss-lint.yml',
        reporterOutput: null
      },
      core: {
        src: ['scss/*.scss', '!scss/_normalize.scss']
      },
      docs: {
        src: ['docs/assets/scss/*.scss', '!docs/assets/scss/docs.scss']
      }
    },

    postcss: {
      core: {
        options: {
          map: true,
          processors: [
            mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.bs-true-hover ' }),
            autoprefixer
          ]
        },
        src: 'dist/css/*.css'
      },
      docs: {
        options: {
          processors: [
            autoprefixer
          ]
        },
        src: 'docs/assets/css/docs.min.css'
      },
      examples: {
        options: {
          processors: [
            autoprefixer
          ]
        },
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
      }
    },

    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie9',
        keepSpecialComments: '*',
        sourceMap: true,
        advanced: false
      },
      core: {
        files: [
          {
            expand: true,
            cwd: 'dist/css',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/css',
            ext: '.min.css'
          }
        ]
      },
      docs: {
        src: 'docs/assets/css/docs.min.css',
        dest: 'docs/assets/css/docs.min.css'
      }
    },

    copy: {
      docs: {
        expand: true,
        cwd: 'dist/',
        src: [
          '**/*'
        ],
        dest: 'docs/dist/'
      }
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        incremental: false
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

    htmllint: {
      options: {
        ignore: [
          'Element “img” is missing required attribute “src”.',
          'Attribute “autocomplete” is only allowed when the input type is “color”, “date”, “datetime”, “datetime-local”, “email”, “month”, “number”, “password”, “range”, “search”, “tel”, “text”, “time”, “url”, or “week”.',
          'Attribute “autocomplete” not allowed on element “button” at this point.',
          'Element “div” not allowed as child of element “progress” in this context. (Suppressing further errors from this subtree.)',
          'Consider using the “h1” element as a top-level heading only (all “h1” elements are treated as top-level headings by many screen readers and other tools).',
          'The “datetime” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The “color” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The “date” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The “datetime-local” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The “month” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The “time” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
          'The “week” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.'
        ]
      },
      src: ['_gh_pages/**/*.html', 'js/tests/visual/*.html']
    },

    watch: {
      src: {
        files: '<%= jscs.core.src %>',
        tasks: ['babel:dev']
      },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['dist-css', 'docs']
      },
      docs: {
        files: 'docs/assets/scss/**/*.scss',
        tasks: ['dist-css', 'docs']
      }
    },

    'saucelabs-qunit': {
      all: {
        options: {
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 10,
          maxRetries: 3,
          maxPollRetries: 4,
          urls: ['http://127.0.0.1:3000/js/tests/index.html?hidepassed'],
          browsers: grunt.file.readYAML('grunt/sauce_browsers.yml')
        }
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    },

    buildcontrol: {
      options: {
        dir: '_gh_pages',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:twbs/derpstrap.git',
          branch: 'gh-pages'
        }
      }
    },

    compress: {
      main: {
        options: {
          archive: 'bootstrap-<%= pkg.version %>-dist.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['**'],
            dest: 'bootstrap-<%= pkg.version %>-dist'
          }
        ]
      }
    }

  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies',
    // Exclude Sass compilers. We choose the one to load later on.
    pattern: ['grunt-*', '!grunt-sass', '!grunt-contrib-sass'] });
  require('time-grunt')(grunt);

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll:docs', 'htmllint']);

  var runSubset = function (subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset;
  };
  var isUndefOrNonZero = function (val) {
    return val === undefined || val !== '0';
  };

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (runSubset('core') &&
    // Skip core tests if this is a Savage build
    process.env.TRAVIS_REPO_SLUG !== 'twbs-savage/bootstrap') {
    testSubtasks = testSubtasks.concat(['dist-css', 'dist-js', 'test-scss', 'test-js', 'docs']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (runSubset('validate-html') &&
      isTravis &&
      // Skip HTML5 validator when [skip validator] is in the commit message
      isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)) {
    testSubtasks.push('validate-html');
  }
  // Only run Sauce Labs tests if there's a Sauce access key
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined' &&
      // Skip Sauce if running a different subset of the test suite
      runSubset('sauce-js-unit') &&
      // Skip Sauce on Travis when [skip sauce] is in the commit message
      isUndefOrNonZero(process.env.TWBS_DO_SAUCE)) {
    testSubtasks.push('babel:dev');
    testSubtasks.push('connect');
    testSubtasks.push('saucelabs-qunit');
  }
  grunt.registerTask('test', testSubtasks);
  grunt.registerTask('test-js', ['jscs:core', 'jscs:test', 'jscs:grunt', 'qunit']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['babel:dev', 'concat', 'babel:dist', 'stamp', 'uglify:core', 'commonjs']);

  grunt.registerTask('test-scss', ['scsslint:core']);

  // CSS distribution task.
  // Supported Compilers: sass (Ruby) and libsass.
  (function (sassCompilerName) {
    require('./grunt/bs-sass-compile/' + sassCompilerName + '.js')(grunt);
  })(process.env.TWBS_SASS || 'libsass');
  // grunt.registerTask('sass-compile', ['sass:core', 'sass:extras', 'sass:docs']);
  grunt.registerTask('sass-compile', ['sass:core', 'sass:docs']);

  grunt.registerTask('dist-css', ['sass-compile', 'postcss:core', 'cssmin:core', 'cssmin:docs']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'test']);

  grunt.registerTask('commonjs', ['babel:umd', 'npm-js']);

  grunt.registerTask('npm-js', 'Generate npm-js entrypoint module in dist dir.', function () {
    var srcFiles = Object.keys(grunt.config.get('babel.umd.files')).map(function (filename) {
      return './' + path.join('umd', path.basename(filename))
    })
    var destFilepath = 'dist/js/npm.js';
    generateCommonJSModule(grunt, srcFiles, destFilepath);
  });

  // Docs task.
  grunt.registerTask('docs-css', ['postcss:docs', 'postcss:examples', 'cssmin:docs']);
  grunt.registerTask('lint-docs-css', ['scsslint:docs']);
  grunt.registerTask('docs-js', ['uglify:docsJs']);
  grunt.registerTask('lint-docs-js', ['jscs:assets']);
  grunt.registerTask('docs', ['lint-docs-css', 'docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs']);
  grunt.registerTask('docs-github', ['jekyll:github']);

  grunt.registerTask('prep-release', ['dist', 'docs', 'docs-github', 'compress']);

  // Publish to GitHub
  grunt.registerTask('publish', ['buildcontrol:pages']);
};
