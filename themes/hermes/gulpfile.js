var gulp = require('gulp');
var sass = require('gulp-dart-sass');
var autoprefixer = require('gulp-autoprefixer');

// 一次性编译 Sass
gulp.task('sass', function () {
    return gulp.src('./source/scss/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./source/css'));
});

// 实时编译
gulp.task('default', gulp.series('sass', function () {
    gulp.watch('./source/scss/_partial/*.scss', gulp.series('sass'));
    gulp.watch('./source/scss/*.scss', gulp.series('sass'));
}));
