// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
  grunt: {
    options: {
      reload: true
    },
    files: ['Gruntfile.js']
  },
  karma: {
    files: [
      '<%= paths.dist %>assets/js/*.js',
      '<%= paths.spec %>**/*.js',
      '<%= paths.dist %>assets/css/*.css'
    ],
    tasks: ['karma:dev_watch:run']
  },
  sass: {
    files: ['<%= paths.scss %>**/*.scss', '<%= paths.doc %>assets/**/*.scss'],
    tasks: ['sass'],
    options: {
      livereload:true
    }
  },
  js: {
    files: ['<%= paths.js %>**/*.js', '<%= paths.doc %>assets/js/**/*.js'],
    tasks: ['copy', 'concat', 'uglify'],
    options: {
      livereload: true
    }
  },
  assemble_all: {
    files: ['<%= paths.doc %>{includes,layouts}/**/*.html'],
    tasks: ['assemble'],
    options: {
      livereload: true
    }
  },
  assemble_pages: {
    files: ['<%= paths.doc %>pages/**/*.html'],
    tasks: ['newer:assemble'],
    options: {
      livereload: true
    }
  },
  assets: {
    options: {
      cwd: '<%= paths.doc %>assets/',
      livereload: true
    },
    files: ['**/*', '!{scss,js}/**/*'],
    tasks: ['copy']
  },
  jst: {
    files: ['<%= paths.doc %>templates/*.html'],
    tasks: ['jst'],
    options: {
      livereload: false
    }
  }
};