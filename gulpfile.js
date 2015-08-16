var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var Server = require('karma').Server;
var jshint = require('gulp-jshint');


gulp.task('lint', function() {
  return gulp.src('public/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * Run test once and exit
 */

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('minify-css', function() {
  return gulp.src('public/assets/css/**/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('compress', function() {
  return gulp.src('public/app/**/*.js')
    .pipe(concat('all.js'))
    .pipe(minify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('default', ['compress', 'minify-css']);

//gulp.task('test', ['test']);
