/* jshint node: true */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  var btoa = require('btoa')
  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' */\n',
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
        src: ['docs/assets/js/application.js', 'docs/assets/js/customizer.js']
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

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: [
        'dist/css/bootstrap.css',
        'dist/css/bootstrap-theme.css',
        'docs/assets/css/docs.css'
      ]
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
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
      bootstrap: {
        options: {
          banner: '<%= banner %>\n',
          report: 'min'
        },
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      customize: {
        options: {
          banner: '/*!\n' +
          ' * Bootstrap Docs (<%= pkg.homepage %>)\n' +
          ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
          ' * Licensed under the Creative Commons Attribution 3.0 Unported License. For\n' +
          ' * details, see http://creativecommons.org/licenses/by/3.0/.\n' +
          ' */\n',
          report: 'min'
        },
        src: [
          'docs/assets/js/less.js',
          'docs/assets/js/jszip.js',
          'docs/assets/js/uglify.js',
          'docs/assets/js/filesaver.js',
          'docs/assets/js/customizer.js'
        ],
        dest: 'docs/assets/js/customize.js'
      }
    },

    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': 'less/bootstrap.less'
        }
      },
      compileTheme: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>-theme.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
        },
        files: {
          'dist/css/<%= pkg.name %>-theme.css': 'less/theme.less'
        }
      },
      minify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css',
          'dist/css/<%= pkg.name %>-theme.min.css': 'dist/css/<%= pkg.name %>-theme.css'
        }
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

    csscomb: {
      sort: {
        options: {
          sortOrder: '.csscomb.json'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css'],
          'dist/css/<%= pkg.name %>-theme.css': ['dist/css/<%= pkg.name %>-theme.css'],
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: ['fonts/*'],
        dest: 'dist/'
      },
      dist_css: {
        expand: true,
        cwd: './dist/css',
        src: ['*.min.css', '*.css.map'],
        dest: 'docs/dist/css'
      },
      dist_js: {
        expand: true,
        cwd: './dist/js',
        src: ['*.min.js'],
        dest: 'docs/dist/js'
      },
      dist_fonts: {
        expand: true,
        src: ['fonts/*'],
        dest: 'docs/dist/'
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
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
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
          browsers: grunt.file.readYAML('sauce_browsers.yml')
        }
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll', 'validation']);

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (!process.env.TWBS_TEST || process.env.TWBS_TEST === 'core') {
    testSubtasks = testSubtasks.concat(['dist-css', 'jshint', 'jscs', 'qunit']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (!process.env.TWBS_TEST || process.env.TWBS_TEST === 'validate-html') {
    testSubtasks.push('validate-html');
  }
  // Only run Sauce Labs tests if there's a Sauce access key
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined'
      // Skip Sauce if running a different subset of the test suite
      && (!process.env.TWBS_TEST || process.env.TWBS_TEST === 'sauce-js-unit')) {
    testSubtasks.push('connect');
    testSubtasks.push('saucelabs-qunit');
  }
  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less', 'csscomb', 'usebanner']);

  // Fonts distribution task.
  grunt.registerTask('dist-docs', ['copy']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-docs', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'build-glyphicons-data', 'build-customizer']);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
  grunt.registerTask('change-version-number', ['sed']);

  grunt.registerTask('build-glyphicons-data', function () {
    var fs = require('fs')

    // Pass encoding, utf8, so `readFileSync` will return a string instead of a
    // buffer
    var glyphiconsFile = fs.readFileSync('less/glyphicons.less', 'utf8')
    var glpyhiconsLines = glyphiconsFile.split('\n')

    // Use any line that starts with ".glyphicon-" and capture the class name
    var iconClassName = /^\.(glyphicon-[^\s]+)/
    var glyphiconsData = '# This file is generated via Grunt task. **Do not edit directly.** \n' +
                         '# See the \'build-glyphicons-data\' task in Gruntfile.js.\n\n';
    for (var i = 0, len = glpyhiconsLines.length; i < len; i++) {
      var match = glpyhiconsLines[i].match(iconClassName)

      if (match != null) {
        glyphiconsData += '- ' + match[1] + '\n'
      }
    }

    // Create the `_data` directory if it doesn't already exist
    if (!fs.existsSync('docs/_data')) fs.mkdirSync('docs/_data')

    fs.writeFileSync('docs/_data/glyphicons.yml', glyphiconsData)
  });

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
    fs.writeFileSync('docs/assets/js/raw-files.js', files)
  });
};
