/*!
 * Bootstrap Grunt task for generating RTL CSS from LTR CSS using css-flip
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
'use strict';

var flip = require('css-flip');


module.exports = function(grunt) {
  grunt.registerMultiTask('cssFlip', 'Generates RTL CSS from LTR CSS using css-flip', function () {
    this.files.forEach(function (f) {
      var unflippedCss = grunt.file.read(f.src);
      var flippedCss = null;
      try {
        flippedCss = flip(unflippedCss);
      }
      catch (err) {
        grunt.fail.warn(err);
      }
      grunt.file.write(f.dest, flippedCss);
      grunt.log.writeln('File ' + f.dest.cyan + ' created.');
    });
  });
};
