var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts', function () {
  gulp.src('./api/v1/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
});
gulp.task('default', function () {
  gulp.run('scripts');
  gulp.watch('./api/v1/*.js', function () {
    gulp.run('scripts');
  });
});

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
  return gulp.src('src/app.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});