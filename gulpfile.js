'use strict';

const gulp        = require('gulp');
const watch       = require('gulp-watch'); // Более умный вотчер
const batch       = require('gulp-batch'); // Пачки задач
const plumber     = require('gulp-plumber'); // Обработка ошибок
const notify      = require('gulp-notify');
const browserSync = require('browser-sync').create();
const exec        = require('gulp-exec'); // Выполнение команд
const minimist    = require('minimist'); // Работа с аргументами команд
//
const twig         = require('gulp-twig');
//
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const sourcemaps   = require('gulp-sourcemaps');
//
const babel        = require('gulp-babel');
const uglify       = require('gulp-uglify');
//
const imagemin     = require('gulp-imagemin');

// Обработка ошибок
const handleError = err => {
  notify.onError({title: 'Gulp error', message: err.message})(err);
};

// Обработка аргументов
const knownOptions = {
  string:  'env',
  default: {env: process.env.NODE_ENV || 'production'}
};

const options = minimist(process.argv.slice(2), knownOptions);

// 1. Девсервер на docs/
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: 'docs/'
    },
    host:   'localhost',
    port:   9000,
    notify: false
  });
});
gulp.task('server:refresh', () => {
  browserSync.reload();
});
gulp.task('server:inject', () => {
  gulp.src('docs/styles/**/*.*')
    .pipe(browserSync.stream());
});

// 2. Билды
gulp.task('docs:html', () => {
  gulp.src([
      'src/pages/*.twig',
      'src/pages/*.html'
    ])
    .pipe(twig())
    .pipe(gulp.dest('docs/'));
});
gulp.task('docs:styles', () => {
  gulp.src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber(handleError))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version'],
        grid: true
      }),
      cssnano({zindex: false, reduceIdents: false})
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('docs/styles/'));
});
gulp.task('docs:scripts', () => {
  gulp.src('src/scripts/vendor/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('docs/scripts/vendor/'));

  gulp.src('src/scripts/*.js')
  .pipe(sourcemaps.init())
  .pipe(plumber(handleError))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('docs/scripts/'));
});
gulp.task('docs:assets', () => {
  gulp.src('src/assets/fonts/**/*.*')
    .pipe(gulp.dest('docs/assets/fonts/'));

  gulp.src('src/assets/other/**/*.*')
  .pipe(gulp.dest('docs/assets/other/'));

  gulp.src('src/assets/json/**/*.*')
  .pipe(gulp.dest('docs/assets/json/'));

  gulp.src('src/assets/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('docs/assets/img/'));

  gulp.src('src/assets/favicon/**/*.*')
    .pipe(gulp.dest('docs/assets/favicon/'));
});

// 3. Вотчеры
gulp.task('watch:docs', ['server', 'docs:html', 'docs:styles', 'docs:scripts', 'docs:assets'], () => {
  watch([
    'src/pages/**/*.twig',
    'src/pages/**/*.html',
    'src/blocks/**/*.twig',
    'src/blocks/**/*.html'
  ], batch((e, end) => {gulp.start('docs:html', end);}));

  watch([
    'src/styles/**/*.*',
    'src/blocks/**/*.scss'
  ], batch((e, end) => {gulp.start('docs:styles', end);}));


  watch('src/scripts/**/*.*', batch((e, end) => {gulp.start('docs:scripts', end);}));
  watch('src/assets/**/*.*', batch((e, end) => {gulp.start('docs:assets', end);}));
});
gulp.task('watch:update', () => {
  watch([
    'docs/*.html',
    'docs/scripts/**/*.*',
    'docs/assets/**/*.*'
  ], batch((e, end) => {gulp.start('server:refresh', end);}));

  watch('docs/styles/**/*.css', batch((e, end) => {gulp.start('server:inject', end);}));
});

// 3. Shell-задачи
gulp.task('createBlock', () => {
  gulp.src('').pipe(exec(`sh tasks/createBlock.sh ${options.name}`));
});
gulp.task('cleardocs', () => {
  gulp.src('').pipe(exec(`rm -rf docs/`));
});

gulp.task('default', ['watch:docs', 'watch:update']);
gulp.task('docs', ['docs:html', 'docs:styles', 'docs:scripts', 'docs:assets']);
