var gulp = require('gulp'),
  concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('copy', function() {
  gulp.src('app/manifest.json')
    .pipe(gulp.dest('build'));
  gulp.src('app/_locales/**')
    .pipe(gulp.dest('build/_locales'));
});

gulp.task('img', function() {
  gulp.src('app/icons/*')
    .pipe(gulp.dest('build/icons'))
});

gulp.task('js', function() {
  gulp.src('app/js/*.js')
    .pipe(gulp.dest('build/js'))
});

gulp.task('css', function() {
  gulp.src('app/css/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('watch', function() {
  gulp.watch(['app/manifest.json', 'app/_locales/**'], ['copy']);
  gulp.watch('app/icons/*', ['img']);
  gulp.watch('app/js/*', ['js']);
  gulp.watch('app/css/*', ['css']);
})

gulp.task('build', ['copy', 'js', 'css', 'img']);
gulp.task('default', ['copy', 'js', 'css', 'img', 'watch']);