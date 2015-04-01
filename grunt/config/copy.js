// https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= paths.doc %>assets/',
      src: ['**/*','!{scss,js}/**/*'],
      dest: '<%= paths.dist %>docs/assets/',
      filter: 'isFile'
    },{
      expand: true,
      cwd: '<%= paths.js %>',
      src: ['foundation/*.js'],
      dest: '<%= paths.dist %>assets/js',
      filter: 'isFile'
    },{
      src: '<%= paths.vendor %>jquery/jquery.min.js',
      dest: '<%= paths.dist %>docs/assets/js/jquery.js'
    },{
      expand: true,
      cwd: '<%= paths.scss %>',
      src: '**/*.scss',
      dest: '<%= paths.dist %>assets/scss/',
      filter: 'isFile'
    },{
      src: 'bower.json',
      dest: '<%= paths.dist %>assets/'
    }]
  }
};