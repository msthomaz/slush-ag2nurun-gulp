var gulp      = require('gulp'),
  stylus      = require('gulp-stylus'),
  browserSync = require('browser-sync'),
  reload      = browserSync.reload,
  uglify      = require('gulp-uglify'),
  concat      = require('gulp-concat'),
  changed     = require('gulp-changed'),
  runSequence = require('run-sequence'),
  gutil       = require('gulp-util');

var path = {
  js: ['dev/assets/js/**/*.js', '!dev/assets/js/**/*.min.js'],
  stylus: ['dev/assets/stylus/**/*.styl'],
  css: ['dev/assets/css/**/*.css', '!dev/assets/css/**/*.min.css'],
  img: ['dev/assets/img/*'],
  html: ['dev/**/*.html']
};

gulp.task('stylus', function () {
  return gulp.src(path.stylus)
    .pipe(stylus({ compress: true }).on('error', function (err) { errorLog(err); }))
    .pipe(gulp.dest('dev/assets/css/'))
    .pipe(reload({stream:true}));
});

gulp.task('sync', function() {
  browserSync({
    server: {
      baseDir: "./dev"
    }
  });
});

gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(reload({stream:true}));
});

gulp.task('watch', function () {
  gulp.watch(path.stylus, ['stylus']);
  gulp.watch(path.html, ['html']);
});

gulp.task('js:build', function () {
  return gulp.src(path.js)
    .pipe(uglify({outSourceMap: true}).on('error', function (err) { errorLog(err); }))
    .pipe(gulp.dest('build/assets/js/'));
});

gulp.task('move:build', function () {
  return gulp.src([ 
    'dev/**',
    '!dev/assets/stylus', 
    '!dev/assets/stylus/**/*.styl',
    '!dev/assets/js',
    '!dev/assets/js/**/*.js'
  ])
  .pipe(gulp.dest('build/'));
});

gulp.task('default', ['stylus', 'watch', 'sync']);
gulp.task('build', function () {
  runSequence('stylus', 'js:build', 'move:build');
});

errorLog = function (err) {
  gutil.log('Arquivo: ' + err.fileName);
  gutil.log('Erro: ' + err.message);
};
