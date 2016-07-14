module.exports = {

  // Metadata.
  pkg: require('../package.json'),
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
                      '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {\n' +
                      '    throw new Error(\'Bootstrap\\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0\')\n' +
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
        'Attribute “autocomplete” is only allowed when the input type is “color”, “date”, “datetime”, “datetime-local”, “email”, “hidden”, “month”, “number”, “password”, “range”, “search”, “tel”, “text”, “time”, “url”, or “week”.',
        'Attribute “autocomplete” not allowed on element “button” at this point.',
        'Consider using the “h1” element as a top-level heading only (all “h1” elements are treated as top-level headings by many screen readers and other tools).',
        'Element “div” not allowed as child of element “progress” in this context. (Suppressing further errors from this subtree.)',
        'Element “img” is missing required attribute “src”.',
        'The “color” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
        'The “date” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
        'The “datetime” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.',
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
      files: '<%= concat.bootstrap.src %>',
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
    postcss: {
      command: 'npm run postcss'
    },
    'postcss-docs': {
      command: 'npm run postcss-docs'
    },
    htmlhint: {
      command: 'npm run htmlhint'
    },
    'upload-preview': {
      command: './grunt/upload-preview.sh'
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
};
