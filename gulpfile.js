var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sh = require('shelljs');

var $ = require('gulp-load-plugins')();

var paths = {
  sass: ['./**/*.scss'],
  jade: ['www/**/*.jade']
};

gulp.task('default', ['sass']);

gulp.task('jade', function(){
  gulp.src(paths.jade)
      .pipe($.jade())
      .on('error', function(error){
        console.warn(error)
      })
      .pipe(gulp.dest('www'))
});

gulp.task('sass', function(done) {
  gulp.src('./scss/bundle.scss')
    .pipe($.sassGlob())
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe($.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe($.rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['jade', 'sass'], function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
