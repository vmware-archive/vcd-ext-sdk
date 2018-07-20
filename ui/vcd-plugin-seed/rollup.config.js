// rollup.config.js
import angular from 'rollup-plugin-angular';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import sass from 'node-sass';
import tsc from 'typescript';

export default {
    entry: 'src/main/index.ts',
    format: 'amd',
    dest: 'dist/bundle.js',
    external: [
        'rxjs',
        'rxjs/operators',
        '@angular/animations',
        '@angular/animations/browser',
        '@angular/common',
        '@angular/common/http',
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
                        return sass.renderSync({ data: scss }).css;
                        return cssmin.minify(css).styles;
                    }
                }
        }),
        typescript({typescript: tsc}),
        resolve({
          only: [ '@vcd/bindings', '@vcd/sdk' ]
        }),
        commonjs()
    ]
}
