"use strict";

let gulp = require("gulp"),
    zip = require("gulp-zip"),
    sass = require("gulp-sass"),
    size = require("gulp-size"),
    concat = require("gulp-concat"),
    insert = require("gulp-insert"),
    server = require("gulp-express"),
    closure = require("google-closure-compiler").gulp(),
    sourcemaps = require("gulp-sourcemaps"),
    pump = require("pump"),
    del = require("del");

gulp.task("clean", function () {
    return del(["dist/*"]);
});

gulp.task("copy", ["clean"], function () {
    gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});

gulp.task("sass", ["clean"], function () {
    return gulp.src("src/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("closure", ["clean"], function () {
    return gulp.src(["src/jsfxr.js", "src/js/**/*.js", "src/script.js"])
        .pipe(sourcemaps.init())
        .pipe(closure({
            compilation_level: "SIMPLE",
            language_in: "ECMASCRIPT6_STRICT",
            language_out: "ECMASCRIPT5_STRICT",
            output_wrapper: "onload=function(){\n%output%\n};",
            js_output_file: "script.js"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("editor", ["clean"], function () {
    return gulp.src(["src/jsfxr.js", "src/js/**/*.js", "src/editor.js"])
        .pipe(sourcemaps.init())
        .pipe(closure({
            compilation_level: "SIMPLE",
            language_in: "ECMASCRIPT6_STRICT",
            language_out: "ECMASCRIPT5_STRICT",
            output_wrapper: "onload=function(){\n%output%\n};",
            js_output_file: "editor.js"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("zip", ["clean", "sass", "closure", "copy"], function () {
    return gulp.src(["dist/index.html", "dist/script.js", "dist/style.css"])
        .pipe(zip("dist.zip"))
        .pipe(size({ title: "Build", pretty: false }))
        .pipe(gulp.dest("."));
});

gulp.task("server", ["default"], function () {
    server.stop();
    server.run(["index.js"]);
});

gulp.task("watch", ["server"], function () {
    gulp.watch("src/**/*.*", ["server"]);
});

gulp.task("default", ["clean", "sass", "closure", "editor", "copy", "zip"]);