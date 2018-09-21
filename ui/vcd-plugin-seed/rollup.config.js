// rollup.config.js
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
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
        'reselect'
    ],
    onwarn (warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        // Use default for everything else
        console.warn(warning);
    },
    plugins: [
        angular(),
        resolve({
            modulesOnly: true
        }),
        typescript({
            clean: true,
            typescript: tsc
        })
    ]
}
