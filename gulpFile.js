const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint-new');

const webpackConfig = require('./webpack.config');

const sassTask = (done) => {
    gulp.src('./scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./hosted'));

    done();
};

const jsTask = (done) => {
    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));

    done();
};

const lintTask = (done) => {
    gulp.src('./server/**/*.js')
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    
    done();
};

const watch = (done) => {
    gulp.watch('./scss', sassTask);
    gulp.watch(['./client/**/*.js', './client/**/*.jsx'], jsTask);
    nodemon({
        script: './server/app.js',
        watch: ['./server'],
        tasks: ['lintTask'],
        done: done,
    });
};

module.exports = {
    build: gulp.parallel(sassTask, jsTask, lintTask),
    herokuBuild: gulp.parallel(sassTask, jsTask),
    sassTask,
    jsTask,
    lintTask,
    watch,
};
