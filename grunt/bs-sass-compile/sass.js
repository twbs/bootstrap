// Compile Bootstrap with [Ruby Sass][1] using [grunt-contrib-sass][2]
// [1]: https://github.com/sass/sass
// [2]: https://github.com/gruntjs/grunt-contrib-sass
module.exports = function configureRubySass(grunt) {
  var options = {
    loadPath: ['scss'],
    precision: 6,
    sourcemap: 'auto',
    style: 'expanded',
    trace: true,
    bundleExec: true
  };
  grunt.config.merge({
    sass: {
      core: {
        options: options,
        files: {
          'dist/css/<%= pkg.name %>.css': 'scss/<%= pkg.name %>.scss'
        }
      },
      extras: {
        options: options,
        files: {
          'dist/css/<%= pkg.name %>-flex.css': 'scss/<%= pkg.name %>-flex.scss',
          'dist/css/<%= pkg.name %>-grid.css': 'scss/<%= pkg.name %>-grid.scss',
          'dist/css/<%= pkg.name %>-reboot.css': 'scss/<%= pkg.name %>-reboot.scss'
        }
      },
      docs: {
        options: options,
        files: {
          'docs/assets/css/docs.min.css': 'docs/assets/scss/docs.scss',
          'docs/assets/css/docs-flexbox.min.css': 'docs/assets/scss/flex-grid.scss'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
};
