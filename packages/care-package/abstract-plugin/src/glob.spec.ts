import { } from 'jasmine';
import path from 'path';
import fs from 'fs';
import { glob } from './glob';


describe('glob Tests', () => {
    it('relative root dir', () => {
        spyOn<any>(fs, 'readdirSync').and.returnValues(
            [ 'dist', 'src'],
            [ 'test.js', 'test2.js', 'config.json' ],
            [ 'test.ts', 'test2.ts', 'config.json' ]
        );
        spyOn<any>(fs, 'statSync').and.callFake((f: string) => {
            return {
                isDirectory: () => f === 'src' || f === 'dist'
            };
        });
        const files = glob('.', 'src/*.ts');
        expect(files).toEqual(['src/test.ts', 'src/test2.ts']);
    });
    it('absolute root dir', () => {
        spyOn<any>(fs, 'readdirSync').and.returnValues(
            [ 'dist', 'src'],
            [ 'test.js', 'test2.js', 'config.json' ],
            [ 'test.ts', 'test2.ts', 'config.json' ]
        );
        spyOn<any>(fs, 'statSync').and.callFake((f: string) => {
            return {
                isDirectory: () => f === path.resolve('src') || f === path.resolve('dist')
            };
        });
        const absPath = path.resolve('.');
        const files = glob(absPath, 'src/*.ts');
        expect(files).toEqual([path.resolve('src/test.ts'), path.resolve('src/test2.ts')]);
    });

});
