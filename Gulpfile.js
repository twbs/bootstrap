/*!
 * Bootstrap's Gulpfile
 * http://getbootstrap.com
 * Copyright 2013-2016 The Bootstrap Authors
 * Copyright 2013-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
 
var autoprefix = require('gulp-autoprefixer'),
    babel      = require('gulp-babel'),
    build      = require('build-control'),
    clean      = require('gulp-clean'),
    cleancss   = require('gulp-clean-css'),
    concat     = require('gulp-concat'),
    debug      = require('gulp-debug'),
    eslint     = require('gulp-eslint'),
    exec       = require('gulp-exec'),
    flexbox    = require('postcss-flexbox-fixes'),
    gulp       = require('gulp'),
    htmlhint   = require('gulp-html-hint'),
    htmllint   = require('gulp-html'),
    isTravis   = require('is-travis'),
    jscs       = require('gulp-jscs'),
    jshint     = require('gulp-jshint'),
    postcss    = require('gulp-postcss'),
    rename     = require('gulp-rename'),
    sass       = require('gulp-ruby-sass'),
    scsslint   = require('gulp-scss-lint'),
    stamp      = require('gulp-stamp'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify');

// Equivalent to time-grunt
require("time-require");

// Project configuration.
var config = require('./gulp/config.js');
config.autoprefixer = require('./gulp/postcss.js').autoprefixer;

// Build SCSS
gulp.task('sass:core', function () {
    var scss = gulp.src('scss/bootstrap.scss', { base: config.core.files.cwd });
    scss
        .pipe(debug({ title: 'sassc:' }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix(config.autoprefixer.browsers))
        .pipe(postcss([flexbox]))
        .pipe(sourcemaps.write())
        .pipe(debug({ title: 'copy:' }))
        .pipe(gulp.dest('dist/css/'));

    scss
        .pipe(debug({ title: 'sassc:' }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix(config.autoprefixer.browsers))
        .pipe(postcss([flexbox]))
        .pipe(cleancss(config.cssmin.options))
        .pipe(sourcemaps.write())
        .pipe(debug({ title: 'copy:' }))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('sass:docs', function () {
    return gulp.src('docs/assets/scss/docs.scss');
        .pipe(debug({ title: 'sassc:' }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix(config.autoprefixer.browsers))
        .pipe(postcss([flexbox]))
        .pipe(cleancss(config.cssmin.options))
        .pipe(debug({ title: 'copy:' }))
        .pipe(gulp.dest('docs/assets/css/'));
});

gulp.task('exec:postcss-docs', function () {
    return gulp.src('docs/examples/**/*.css')
        .pipe(autoprefix(config.autoprefixer.browsers))
        .pipe(postcss([flexbox]));
});

gulp.task('clean:dist', function () {
    return gulp.src('dist/**')
        .pipe(clean());
});

gulp.task('clean:docs', function () {
    return gulp.src('docs/dist/**')
        .pipe(clean());
});

gulp.task('cssmin:docs', function () {
    return gulp.src(config.cssmin.docs.src)
        .pipe(cleancss(config.cssmin.options))
        .pipe(gulp.dest(config.cssmin.docs.dest));
});

gulp.task('htmllint', function () {
    return gulp.src(config.htmllint.src)
        .pipe(htmllint());
});

gulp.task('htmlhint', function () {
    return gulp.src('_gh_pages/**/*.md')
        .pipe(htmlhint('docs/.htmlhintrc'));
});

gulp.task('jekyll:docs', function (cb) {
    exec('jekyll build --incremental', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('babel:dev', function () {
    return gulp.src('js/src/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('bootstrap.js'))
        .pipe(babel(config.babel.options))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/dist/'));
});

gulp.task('concat', function () {
    gulp.src(config.concat.bootstrap.src)
        .pipe(concat('bootstrap.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('babel:dist', function () {
    return gulp.src(config.concat.bootstrap.dest)
        .pipe(babel())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('stamp', function () {
    return gulp.src(config.concat.bootstrap.dest)
        .pipe(stamp(config.stamp.options))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('uglify:core', function () {
    return gulp.src(config.concat.bootstrap.dest)
        .pipe(uglify(config.uglfy.options))
        .pipe(rename('bootstrap.min.js'))
        .pipe('dist/js/');
});

gulp.task('watch', function () {
    gulp.watch(config.watch.sass.files, config.watch.sass.tasks);
    gulp.watch(config.watch.src.files, config.watch.src.tasks);
    gulp.watch(config.watch.docs.files, config.watch.docs.tasks);
});

// Docs HTML validation task
gulp.task('validate-html', ['jekyll:docs', 'htmllint', 'htmlhint']);
// JS distribution task.
gulp.task('dist-js', ['babel:dev', 'concat', 'babel:dist', 'stamp', 'uglify:core']);

gulp.task('test-scss', function () {
    return gulp.src(config.scsslint.core.src)
        .pipe(scsslint(config.scsslint.options));
});

// CSS distribution task.
// gulp.task('sass-compile', ['sass:core', 'sass:extras', 'sass:docs']);
gulp.task('sass-compile', ['sass:core', 'sass:docs']);

gulp.task('dist-css', ['sass-compile', 'cssmin:docs']);

// Full distribution task.
gulp.task('dist', ['clean:dist', 'dist-css', 'dist-js']);

// Default task.
gulp.task('default', ['clean:dist', 'test']);
gulp.task('test', ['eslint', 'jscs', ]);
gulp.task('eslint', function () {
    var options = require('./js/.eslintrc.json');
    return gulp.src('js/src/*.js')
        .pipe(eslint(options))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task('jscs', function () {
    var options = require('./js/.jscsrc');
    return gulp.src(['js/src/*', 'js/tests/unit', 'docs/assets/js/src/*', 'gulp/*', 'Gulpfile.js', 'docs/assets/js/ie-emulation-modes-warning.js', 'docs/assets/js/ie10-viewport-bug-workaround.js'])
        .pipe(jscs(options))
        .pipe(jscs.reporter());
});
// Docs task.
gulp.task('docs-css', ['cssmin:docs', 'exec:postcss-docs']);
gulp.task('lint-docs-css', function () {
    return gulp.src(config.scsslint.docs.src)
        .pipe(scsslint(config.scsslint.options));
});
gulp.task('docs-js', ['uglify:docsJs']);
gulp.task('docs', ['lint-docs-css', 'docs-css', 'docs-js', 'clean:docs', 'copy:docs']);
gulp.task('docs-github', function (cb) {
    exec('jekyll build --incremental', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('prep-release', ['dist', 'docs', 'docs-github', 'compress']);

// Publish to GitHub
gulp.task('publish', function () {
    build(config.buildcontrol.options);
});
