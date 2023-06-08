var gulp      =   require('gulp'),
  zip         =   require('gulp-zip'),
  watch       =   require('gulp-watch'),
  clean       =   require('gulp-clean'),
  jshint      =   require('gulp-jshint'),
  concat      =   require('gulp-concat'),
  uglify      =   require('gulp-uglify'),
  cssmin      =   require('gulp-cssmin'),
  rename      =   require('gulp-rename'),
  htmlmin     =   require('gulp-htmlmin'),
  replace     =   require('gulp-replace-path');

var APP_NAME = 'save_the_forest';
var bases = {
  app: 'src/',
  dist: 'dist/',
};

var paths = {
  scripts: [
    'src/utils.js',
    'src/jsfxr.js',
    'src/sound.js',
    'src/flame.js',
    'src/menu.js',
    'src/weather.js',
    'src/particles.js',
    'src/background.js',
    'src/player.js',
    'src/tree.js',
    'src/game.js',
    'src/main.js'
  ],
  html: [ 'src/index.html' ],
  css: [ 'src/css/*.css' ],
  images: [ 'src/images/*.*' ]
};

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist, {read: false})
    .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    .pipe(concat('game.js'))
    .pipe(gulp.dest(bases.dist)) // for dev mode
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(bases.dist)) // for prod
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  // Copy images, maintaining the original directory structure
  return gulp.src(paths.images, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));
});

gulp.task('uglify-html', ['clean'], function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(replace(/..\/dist\//g, ''))
    .pipe(replace(/game.css/g, 'game.min.css'))
    .pipe(replace(/game.js/g, 'game.min.js'))
    .pipe(gulp.dest(bases.dist));
});

gulp.task('uglify-css', ['clean'], function () {
  return gulp.src('css/*.css', {cwd: bases.app})
    .pipe(gulp.dest(bases.dist)) // for dev mode
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(bases.dist)); // for prod
});

// Delete the dist directory
gulp.task('zip', ['default'], function() {
  return gulp.src([ 'dist/**/*.min.*', 'dist/index.html' ])
    .pipe(zip(APP_NAME + '.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch' , function () {
  return gulp.watch([
    paths.scripts,
    paths.html,
    paths.images,
    paths.css
  ], ['default']);
});

// Define the default task as a sequence of the above tasks
gulp.task('default', [
  'clean',
  'copy',
  'scripts',
  'uglify-html',
  'uglify-css'
]);
