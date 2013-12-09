/* jshint node: true */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = require('regexp-quote')
  var btoa = require('btoa')
  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
              ' */\n\n',
    jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',

    // Task configuration.
    clean: {
      dist: ['dist']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      },
      assets: {
        src: ['docs-assets/js/application.js', 'docs-assets/js/customizer.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscs.json',
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %><%= jqueryCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      customize: {
        src: [
          'docs-assets/js/less.js',
          'docs-assets/js/jszip.js',
          'docs-assets/js/uglify.js',
          'docs-assets/js/filesaver.js',
          'docs-assets/js/customizer.js'
        ],
        dest: 'docs-assets/js/customize.js'
      }
    },

    less: {
      compile: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'less/bootstrap.less',
          'dist/css/<%= pkg.name %>-theme.css': 'less/theme.less'
        }
      },
      minify: {
        options: {
          compress: true
        },
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css',
          'dist/css/<%= pkg.name %>-theme.min.css': 'dist/css/<%= pkg.name %>-theme.css'
        }
      }
    },

    csscomb: {
      options: {
        // sortOrder: '/.csscomb.json',
          "always-semicolon": true,
          "block-indent": true,
          "colon-space": true,
          "color-case": "lower",
          "color-shorthand": true,
          "combinator-space": true,
          "element-case": "lower",
          "eof-newline": true,
          "leading-zero": false,
          "remove-empty-rulesets": true,
          "rule-indent": true,
          "stick-brace": "\n",
          "strip-spaces": true,
          "unitless-zero": true,
          "vendor-prefix-align": true
      },
      files: {
        'dist/css/<%= pkg.name %>.sorted.css': ['dist/css/<%= pkg.name %>.css'],
        'dist/css/<%= pkg.name %>.min.sorted.css': ['dist/css/<%= pkg.name %>.min.css'],
        'dist/css/<%= pkg.name %>-theme.sorted.css': ['dist/css/<%= pkg.name %>-theme.css'],
        'dist/css/<%= pkg.name %>-theme.min.sorted.css': ['dist/css/<%= pkg.name %>-theme.min.css']
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'dist/css/<%= pkg.name %>.css',
            'dist/css/<%= pkg.name %>.min.css',
            'dist/css/<%= pkg.name %>-theme.css',
            'dist/css/<%= pkg.name %>-theme.min.css',
          ]
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: ['fonts/*'],
        dest: 'dist/'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
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
      docs: {}
    },

    validation: {
      options: {
        reset: true,
        relaxerror: [
          'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
          'Element img is missing required attribute src.'
        ]
      },
      files: {
        src: ['_gh_pages/**/*.html']
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      less: {
        files: 'less/*.less',
        tasks: ['less']
      }
    },

    sed: {
      versionNumber: {
        pattern: (function () {
          var old = grunt.option('oldver')
          return old ? RegExp.quote(old) : old
        })(),
        replacement: grunt.option('newver'),
        recursive: true
      }
    },

    'saucelabs-qunit': {
      all: {
        options: {
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 3,
          urls: ['http://127.0.0.1:3000/js/tests/index.html'],
          browsers: [
            // See https://saucelabs.com/docs/platforms/webdriver
            {
              browserName: 'safari',
              version: '6',
              platform: 'OS X 10.8'
            },
            {
              browserName: 'chrome',
              version: '28',
              platform: 'OS X 10.6'
            },
            /* FIXME: currently fails 1 tooltip test
            {
              browserName: 'firefox',
              version: '25',
              platform: 'OS X 10.6'
            },*/
            // Mac Opera not currently supported by Sauce Labs
            /* FIXME: currently fails 1 tooltip test
            {
              browserName: 'internet explorer',
              version: '11',
              platform: 'Windows 8.1'
            },*/
            /*
            {
              browserName: 'internet explorer',
              version: '10',
              platform: 'Windows 8'
            },
            {
              browserName: 'internet explorer',
              version: '9',
              platform: 'Windows 7'
            },
            {
              browserName: 'internet explorer',
              version: '8',
              platform: 'Windows 7'
            },
            {// unofficial
              browserName: 'internet explorer',
              version: '7',
              platform: 'Windows XP'
            },
            */
            {
              browserName: 'chrome',
              version: '31',
              platform: 'Windows 8.1'
            },
            {
              browserName: 'firefox',
              version: '25',
              platform: 'Windows 8.1'
            },
            // Win Opera 15+ not currently supported by Sauce Labs
            {
              browserName: 'iphone',
              version: '6.1',
              platform: 'OS X 10.8'
            },
            // iOS Chrome not currently supported by Sauce Labs
            // Linux (unofficial)
            {
              browserName: 'chrome',
              version: '30',
              platform: 'Linux'
            },
            {
              browserName: 'firefox',
              version: '25',
              platform: 'Linux'
            }
            // Android Chrome not currently supported by Sauce Labs
            /* Android Browser (super-unofficial)
            {
              browserName: 'android',
              version: '4.0',
              platform: 'Linux'
            }
            */
          ],
        }
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-jscs-checker');
  // grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-sed');

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll', 'validation']);

  // Test task.
  var testSubtasks = ['dist-css', 'jshint', 'jscs', 'qunit', 'validate-html'];
  // Only run Sauce Labs tests if there's a Sauce access key
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined') {
    testSubtasks.push('connect');
    testSubtasks.push('saucelabs-qunit');
  }
  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less', 'csscomb', 'usebanner']);

  // Fonts distribution task.
  grunt.registerTask('dist-fonts', ['copy']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-fonts', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'build-customizer']);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
  grunt.registerTask('change-version-number', ['sed']);

  // task for building customizer
  grunt.registerTask('build-customizer', 'Add scripts/less files to customizer.', function () {
    var fs = require('fs')

    function getFiles(type) {
      var files = {}
      fs.readdirSync(type)
        .filter(function (path) {
          return type == 'fonts' ? true : new RegExp('\\.' + type + '$').test(path)
        })
        .forEach(function (path) {
          var fullPath = type + '/' + path
          return files[path] = (type == 'fonts' ? btoa(fs.readFileSync(fullPath)) : fs.readFileSync(fullPath, 'utf8'))
        })
      return 'var __' + type + ' = ' + JSON.stringify(files) + '\n'
    }

    var files = getFiles('js') + getFiles('less') + getFiles('fonts')
    fs.writeFileSync('docs-assets/js/raw-files.js', files)
  });
};
