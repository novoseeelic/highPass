import gulp from 'gulp';
const { src, dest, series, watch } = gulp;
import concat from 'gulp-concat';
import htmlMin from 'gulp-htmlmin';
import autoPrefixer from 'gulp-autoprefixer';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import gulpImage from 'gulp-image';
import uglify from 'gulp-uglify-es';
import babel from 'gulp-babel';
import gulpIf from 'gulp-if';
import del from 'del';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);
const sync = browserSync.create();

let prod = false;
let folder = 'dev';

const toProd = (done) => {
  prod = true;
  folder = 'dist';
  done();
};

const clean = () => {
  return del([folder]);
};

const components = () => {
  return src('src/components/**')
    .pipe(dest(`${folder}/components`));
};

const styles = () => {
  return src([
    'src/styles/**/*.css',
    'src/styles/style.scss'
  ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(prod, autoPrefixer({
      cascade: false
    }), sourcemaps.init()))
    .pipe(gulpIf(prod, cleanCSS({
      level: 2
    }), sync.stream()))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(dest(folder));
};

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpIf(prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest(folder));
};

const images = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg'
  ])
    .pipe(gulpImage())
    .pipe(dest(`${folder}/images`));
};

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/**/*.js'
  ])
    .pipe(gulpIf(prod, babel({
      presets: ['@babel/env']
    }), sourcemaps.init()))
    .pipe(gulpIf(prod, uglify.default({
      toplevel: true
    }).on('error', notify.onError(), sync.stream())))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(`${folder}/js`));
};

const watchFiles = () => {
  sync.init({
    server: {
      baseDir: 'dev'
    }
  });
};

watch('src/**/*.html', htmlMinify);
watch('src/**/*.scss', styles);
watch('src/**/*.js', scripts);
watch('src/components/**', components);

export { styles, htmlMinify };
export default series(clean, components, htmlMinify, styles, images, scripts, watchFiles);
export const prodBuild = series(toProd, components, clean, htmlMinify, styles, scripts, images);