const gulp = require('gulp')
const rollup = require('rollup')
const angular = require('rollup-plugin-angular')
const typescript = require('rollup-plugin-typescript')
const sass = require('node-sass')
const tsc = require('typescript')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const concat = require('gulp-concat')

gulp.task('build', function () {
  return rollup.rollup({
    entry: './src/main/index.ts',
    external: [
      'rxjs',
      '@angular/animations',
      '@angular/animations/browser',
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/forms',
      '@angular/http',
      '@angular/platform-browser',
      '@angular/platform-browser/animations',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      '@ngrx/core',
      '@ngrx/store',
      '@ngrx/effects',
      'clarity-angular',
      'reselect',
      '@vcd-ui/common'
    ],
    plugins: [
      angular({
        preprocessors: {
          style: scss => {
            return sass.renderSync({ data: scss }).css
            return cssmin.minify(css).styles
          }
        }
      }),
      typescript({ typescript: tsc }),
      resolve(),
      commonjs({
        include: 'node_modules/**'
      })
    ]
  })
    .then(bundle => {
      return bundle.write({
        dest: './dist/bundle.js',
        format: 'amd'
      })
    })
    .then(() => {
      return gulp.src([
        './dist/bundle.js',
        './libs/zip.js',
        './libs/zip-ext.js',
        './libs/deflate.js',
        './libs/inflate.js'
      ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./dist/'))
    })
})
