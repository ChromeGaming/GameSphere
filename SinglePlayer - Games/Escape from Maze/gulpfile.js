var gulp = require('gulp'), 
concat = require('gulp-concat'),
zip = require('gulp-zip'),
cssmin = require('gulp-cssmin'),
htmlmin = require('gulp-htmlmin'),
rimraf = require('gulp-rimraf'),
size = require('gulp-size'),
minifier = require('gulp-uglify/minifier'),
webserver = require('gulp-webserver');
  

gulp.task('default', ['build']);
gulp.task('build', ['build_source','build_index', 'build_styles','compress','webserver']);
 
gulp.task('build_source',['clean'], () => {
  return gulp.src(['src/utils.js','src/sound.js','src/scoreBoard.js','src/glitch.js','src/maze.js','src/player.js','src/game.js','src/ui.js',])
   .pipe(concat('game.min.js'))
   .pipe(gulp.dest('build'))
})

gulp.task('build_index', function() {
    return gulp.src('src/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true}))
    .pipe(gulp.dest('build'));
});
 
gulp.task('build_styles', function() {
    return gulp.src('src/main.css')
    .pipe(cssmin())
    .pipe(gulp.dest('build'));
});
  
gulp.task('compress',['build_source'], function() {
 return gulp.src('build/*.*')
    .pipe(zip('archive.zip'))
    .pipe(size())
    .pipe(gulp.dest('build'))
});
 
gulp.task('clean', function () {
    return gulp.src('build/*.*', {read: false})
          .pipe(rimraf());
});

/*Needed as cookies used in scoreboard cannot be saved from a file:// address */ 
gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['build_source']);
  gulp.watch('src/main.css', ['build_styles']);
  gulp.watch('src/index.html', ['build_index']);
});