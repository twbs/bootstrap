var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task("js", function(){
return  browserify('./app.js', {debug:true})
          .transform(babelify)
          .bundle()
          .pipe(source('bundle.js'))
          .pipe(gulp.dest('./public/js'));
});
