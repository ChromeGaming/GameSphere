/*global require*/
/*global console*/

(function () {
    
    "use strict";

    var gulp = require("gulp"),
        htmlmin = require("gulp-htmlmin"),
        uglify = require("gulp-uglify"),
        minifyCSS = require("gulp-csso"),
        zip = require("gulp-zip"),
        size = require("gulp-size"),
        clean = require("gulp-clean");

    gulp.task("default", function () {
        
        console.log("CHECK");

        var count = 0,
            taskCompleted = function (taskName) {
                console.log(taskName + " completed");
                count = count + 1;
                if (count === 4) {
                    gulp.src("build/*")
                        .pipe(zip("build.zip"))
                        .pipe(gulp.dest("./"))
                        .on("end", function () {
                            console.log("ZIP build completed");
                        
                            gulp.src("build.zip")
                                .pipe(size({title: "Zipped File Size", pretty: false}))
                                .pipe(gulp.dest("./"));
                        
                            gulp.src("build/")
                                .pipe(clean(), {read: false});

                        });
                }
            };
        
        // Uglify JS and save to build directory (except audio.js as this causes problems)
        gulp.src("src/!(audio.js|*.css|index.html)")
            .pipe(uglify())
            .pipe(gulp.dest("build/"))
            .on("end", function () {
                taskCompleted("Uglify JS");
            });
        
        // copy audio.js to build directory
        gulp.src("src/audio.js")
            .pipe(gulp.dest("build/"))
            .on("end", function () {
                taskCompleted("Copy audio.js file");
            });

        // Minify CSS and save to build directory
        gulp.src("src/*.css")
            .pipe(minifyCSS())
            .pipe(gulp.dest("build/"))
            .on("end", function () {
                taskCompleted("Minify CSS");
            });

        // Copy HTML file to build directory
        gulp.src("src/index.html")
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest("build/"))
            .on("end", function () {
                taskCompleted("Minify HTML file");
            });

    });
    
}());