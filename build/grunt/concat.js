module.exports = {
  options: {
    // Custom function to remove all export and import statements
    process(src) {
      return src.replace(/^(export|import).*/gm, '')
    }
  },
  js: {
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
}
