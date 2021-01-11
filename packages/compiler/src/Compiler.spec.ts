import { } from 'jasmine';
import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { Compiler } from './Compiler';

const loadFlagsJson = (rootDir) => {
    const pjsonPath = path.resolve(rootDir, 'flags.json');
    if (!fs.existsSync(pjsonPath)) {
        return {};
    }
    const fileContent = fs.readFileSync(pjsonPath).toString();
    return JSON.parse(fileContent);
};

describe('Compiler Tests', () => {
    const rootDir = path.resolve(__dirname, '..', 'tests');
    fs.readdirSync(rootDir)
        .forEach(file => {
            it(file, () => {
                const expectedFileNames = globSync(path.resolve(rootDir, file, 'expected', '**/*'), { nodir: true });
                const mkdirSyncSpy = spyOn(fs, 'mkdirSync');
                const writeFileSpy = spyOn(fs, 'writeFile');
                new Compiler(null, {
                    rootDir: path.join(rootDir, file, 'input'),
                    outDir: path.join(rootDir, file, 'expected'),
                    ...loadFlagsJson(path.join(rootDir, file))
                }).compile();
                expect(mkdirSyncSpy).toHaveBeenCalled();
                expect(writeFileSpy).toHaveBeenCalled();
                writeFileSpy.calls.allArgs().forEach(args => {
                    expect(expectedFileNames.includes(args[0].toString())).toBeTruthy('Generated unexpected file');
                    const expectedJson = JSON.parse(fs.readFileSync(args[0].toString()).toString());
                    const actualJson = JSON.parse(args[1]);
                    expect(expectedJson).toEqual(actualJson);
                });
            });
        });
});
