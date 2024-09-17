const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoPrefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const image = require('gulp-image')
const uglify = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const gulpIf = require('gulp-if')
const del = require('del')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

let prod = false
let folder = 'dev'

const toProd = (done) => {
  prod = true
  folder = 'dist'
  done()
}

const clean = () => {
  return del([folder])
}

const components = () => {
  return src('src/components/**')
    .pipe(dest(`${folder}/components`))
}

const styles = () => {
  return src(['src/styles/**/*.css',
      'src/styles/style.scss'    
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(prod, autoPrefixer({
      cascade: false
    }), sourcemaps.init()))
    .pipe(gulpIf(prod, cleanCSS({
      level: 2
    }), browserSync.stream()))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(dest(folder))
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpIf(prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest(folder))
}

const images = () => {
  return src([
      'src/images/**/*.jpg',
      'src/images/**/*.jpeg',
      'src/images/**/*.png',
      'src/images/*.svg'
    ])
    .pipe(image())
    .pipe(dest(`${folder}/images`))
}

const scripts = () => {
  return src([
      'src/js/components/**/*.js',
      'src/js/**/*.js'
    ])
    .pipe(gulpIf(prod, babel({
      presets: ['@babel/env']
    }), sourcemaps.init()))
    .pipe(gulpIf(prod, uglify({
      toplevel: true
    }).on('error', notify.onError(), browserSync.stream())))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(`${folder}/js`))
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dev'
    }
  })
}

watch('src/**/*.html', htmlMinify)
watch('src/**/*.scss', styles)
watch('src/**/*.js', scripts)
watch('src/components/**', components)

exports.styles = styles
exports.htmlMinify = htmlMinify
exports.default = series(clean, components, htmlMinify, styles, images, scripts, watchFiles)
exports.prod = series(toProd, components, clean, htmlMinify, styles, scripts, images)