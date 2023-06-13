var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var minifycss = require('gulp-minify-css');
var path = require('path');
var zip = require('gulp-zip');
var gulpsync = require('gulp-sync')(gulp);

var paths = {
    appJs: ['./game/**/*.js'],
    css: './css/**/*.css'
};


//lint js code
gulp.task('lintJs', function () {
    return gulp.src(paths.appJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


/**
 * concat all app files and create mapping
 */
gulp.task('compileJs', function () {
    return gulp.src(paths.appJs)
        .pipe(concat('game.js'))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(gulp.dest('build/'));
});


/**
 * compile stylus to css and minify it
 */
gulp.task('compileCss', function () {
    return gulp.src(paths.css)
        .pipe(minifycss())
        .pipe(gulp.dest('build/'));
});

gulp.task('zip', function (){
   return gulp.src('build/*')
       .pipe(zip('TheMoleGame.zip'))
       .pipe(gulp.dest(''));
});

gulp.task('default', gulpsync.sync(['compileJs', 'compileCss', 'zip','lintJs']));

