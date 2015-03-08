'use strict';

var gulp = require('gulp');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');

var browserify = require('browserify');
var transform = require('vinyl-transform');
var gulpts = require('gulp-typescript-compiler');

gulp.task('ts-compile', function() {
    return gulp
        .src('src/**/*.ts')
        .pipe(gulpts({
            module: 'commonjs',
            target: 'ES5',
            sourcemap: true,
            logErrors: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('browserify', ['ts-compile'], function() {
    var bundle = transform(function(filename) {
        return browserify({
            debug: true,
            entries: [filename],
            paths: ['./node_modules', './build/']
        }).bundle();
    });

    return gulp.src('build/index.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(bundle)
        .pipe(sourcemaps.write())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['browserify']);

gulp.task('build-tests', ['ts-compile'], function() {
    return gulp.src('test/*.ts')
        .pipe(gulpts({
            module: 'commonjs',
            target: 'ES5',
            sourcemap: false,
            logErrors: true
        }))
        .pipe(gulp.dest('build/test'));
});

gulp.task('test', ['build-tests'], function() {
    return gulp.src('build/test/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});