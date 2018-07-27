// rollup.config.js
import angular from 'rollup-plugin-angular'
import typescript from 'rollup-plugin-typescript'
import sass from 'node-sass'
import tsc from 'typescript'

export default {
  input: 'src/main/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'amd'
  },
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
    typescript({ typescript: tsc })
  ]
}
