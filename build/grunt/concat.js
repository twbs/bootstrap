module.exports = {
  js: {
    options: {
      // Custom function to remove all export and import statements
      process(src) {
        return src.replace(/^(export|import).*/gm, '')
      },
      sourceMap: true,
      sourceMapStyle: 'inline'
    },
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
  },
  'banner-footer': {
    options: {
      sourceMap: true,
      sourceMapStyle: 'inline',
      banner: '<%= stampConf.banner %>\n<%= stampConf.jqueryCheck %>\n<%= stampConf.jqueryVersionCheck %>\n+function () {\n',
      footer: '\n}();'
    },
    src: 'dist/js/<%= pkg.name %>.js',
    dest: 'dist/js/<%= pkg.name %>.js'
  }
}
