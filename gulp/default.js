const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const fs = require('fs');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const isProduction = require('./isProduction');

const cleanDir = gulp.task('cleanDir', callback => {
   const stram = gulp.src('dist');

   stram
       .pipe(clean())
       .on('finish', callback);
});

const js = gulp.task('js', (callBack) => {

        const babelrc = JSON.parse(fs.readFileSync('.babelrc'));

        const stream = gulp.src('src/*.js', {
            sourcemaps: !isProduction()
        });

        stream
            // .pipe(eslint())
            // .pipe(eslint.format())
            .pipe(babel(babelrc))
            .pipe(uglify())
            .pipe(gulp.dest('dist', {
                sourcemaps: '.'
            }))
            .on('finish', callBack);
    }
);

const watch = gulp.task('watch', (callback) => {
    if (isProduction()) {
        callback();
        return;
    }

    console.info('Watch start');

    gulp.watch('src/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series('cleanDir', 'js', 'watch'));