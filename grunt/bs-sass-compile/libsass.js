// Compile Bootstrap with [libsass][1] using [grunt-sass][2]
// [1]: https://github.com/sass/libsass
// [2]: https://github.com/sindresorhus/grunt-sass
module.exports = function configureLibsass(grunt) {
  grunt.config.merge({
    sass: {
      options: {
        includePaths: ['scss'],
        precision: 6,
        sourceComments: false,
        sourceMap: true
      },
      core: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'scss/_<%= pkg.name %>.scss'
        }
      },
      docs: {
        files: {
          'docs/assets/css/docs.min.css': 'docs/assets/scss/docs.scss'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-sass');
};
