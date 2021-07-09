import {} from 'jasmine';
import {BaseNewActions} from './BaseNewActions';
import { Plugin } from '@vcd/care-package-def';

export class TestPlugin implements Plugin {
    name = 'test';
    module = '../CarePackageGenerator.spec/TestPlugin';
    displayName = 'Test Plugin';

    newActions = new BaseNewActions();

    buildActions = {};

    deployActions = {};

    workingDirectory(): string {
        return 'test/lib';
    }
}

describe('BaseNewActions Tests', () => {
    it('Generate plugin files', () => {
        const fs = jasmine.createSpyObj('fs', ['copyTpl', 'readJSON', 'writeJSON']);
        fs.readJSON.and.returnValue({
            elements: []
        });
        const generator = jasmine.createSpyObj('generator', ['sourceRoot', 'templatePath', 'destinationPath']);
        generator.fs = fs;
        const answers = {
            elements: {
                test: {
                    name: 'test'
                }
            }
        };
        const plugin = new TestPlugin();
        plugin.newActions.generate(plugin, generator, answers);
        expect(generator.sourceRoot).toHaveBeenCalledWith('test/templates');
        expect(generator.templatePath).toHaveBeenCalled();
        expect(generator.destinationPath).toHaveBeenCalled();
    });
    it('Generate generate plugin files, no name provided', () => {
        const fs = jasmine.createSpyObj('fs', ['copyTpl', 'readJSON', 'writeJSON']);
        fs.readJSON.and.returnValue({
            elements: []
        });
        const generator = jasmine.createSpyObj('generator', ['sourceRoot', 'templatePath', 'destinationPath']);
        generator.fs = fs;
        const answers = {
            elements: {
                test: {}
            }
        };
        const plugin = new TestPlugin();
        plugin.newActions.generate(plugin, generator, answers);
        expect(generator.sourceRoot).toHaveBeenCalledWith('test/templates');
        expect(generator.templatePath).toHaveBeenCalled();
        expect(generator.destinationPath).toHaveBeenCalled();
    });
});
