/// <binding ProjectOpened='sass:watch, js:watch' />
'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    babelify = require('babelify'),
    browserify = require("browserify"),
    connect = require("gulp-connect"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer");

gulp.task('sass', () => {
    return gulp.src('./asset_modules/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./wwwroot/css/'));
});

gulp.task("buildjs", function () {
      return browserify({
          entries: ["./asset_modules/js/main.js"]
      })
      .transform(babelify.configure({
          presets: ["es2015"]
      }))
      .bundle()
      .pipe(source("scripts.js"))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest("./wwwroot/js/"));
});

gulp.task('sass:watch', () => {
    gulp.watch('./asset_modules/sass/**/*.scss', ['sass']);
});

gulp.task('js:watch', () => {
    gulp.watch('./asset_modules/js/**/*.js', ['buildjs']);
});