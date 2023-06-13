var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var zip = require('gulp-zip');
var fs = require('fs');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var watch = require('gulp-watch');

//

// Chalk colours.
var error = chalk.bold.red;
var success = chalk.green;
var regular = chalk.white;

//

gulp.task('watch', function() {
    gulp.watch('./src/index.html', gulp.series('build-html', 'html-replace', 'zip', 'check'));
    gulp.watch('./src/scss/**/*.scss', gulp.series('compile-sass', 'build-css', 'zip', 'check'));
	gulp.watch('./src/js/**/*.js', gulp.series('build-js', 'zip', 'check'));
});

//

gulp.task('html-replace', function() {
	return gulp.src('./build/**/*.html')
        .pipe(htmlreplace({
            'css': 'app.css',
            'game': 'game.js'
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('zip', function() {
	return gulp.src('./build/**/*')
		.pipe(zip('entry.zip'))
		.pipe(gulp.dest('dist'));
});

gulp.task('check', gulp.series('zip', function(done) {
	var stats = fs.statSync("./dist/entry.zip")
	var fileSize = stats.size;
	if (fileSize > 13312) {
		console.log(error("Your zip compressed game is larger than 13kb (13312 bytes)!"))
		console.log(regular("Your zip compressed game is " + fileSize + " bytes"));
	} else {
		console.log(success("Your zip compressed game is " + fileSize + " bytes."));
	}
	done();
}));

//

gulp.task('build-html', function() {
	return gulp.src('./src/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('compile-sass', function() {
    return gulp.src('./src/scss/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'));
});

gulp.task('build-css', function() {
	return gulp.src('./src/css/**/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest('./build/'));
});

gulp.task('build-js', function() {
	return gulp.src('./src/js/**/*.js')
    	.pipe(uglify())
    	.pipe(gulp.dest('./build/'));
});

gulp.task('build', gulp.series('build-html', 'compile-sass', 'build-css', 'build-js', 'html-replace', 'check', function(done) {
	done();
}));
