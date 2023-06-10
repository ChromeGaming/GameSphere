const gulp = require('gulp');
const size = require('gulp-size');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const plumber = require('gulp-plumber');
const addsrc = require('gulp-add-src');

gulp.task('build', function() {
  return gulp.src(['src/kontra.js', 'src/wavesurfer.js', 'src/globals.js', 'src/ui.js', 'src/*.js', '!src/main.js'])
    .pipe(addsrc.append('src/main.js'))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('.'))
    .pipe(rename('dist.js'))
    .pipe(plumber())
    .pipe(terser())
    .pipe(plumber.stop())
    .pipe(size({
      gzip: true
    }))
    .pipe(gulp.dest('.'))
});

gulp.task('dist', function() {
  return gulp.src(['./dist.js', 'index.html'])
    .pipe(size({
      gzip: true
    }))
})

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['build', 'dist']);
});

gulp.task('default', ['build']);