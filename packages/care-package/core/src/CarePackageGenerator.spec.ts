import { } from 'jasmine';
import * as path from 'path';
import { CarePackageGenerator } from './CarePackageGenerator';
import { Plugin } from '@vcd/care-package-def';
import { JSONSchema7 } from 'json-schema';

export class TestPlugin implements Plugin {
    name = 'test';
    module = '../CarePackageGenerator.spec/TestPlugin';
    displayName = 'Test Plugin';

    buildActions = {
        getInputSchema: (): JSONSchema7  => null
    };

    deployActions = {
        getInputSchema: (): JSONSchema7  => null
    };
}

describe('CarePackageGenerator Tests', () => {
    it('Loads plugins and returns create spec', async () => {
        const spec = (await CarePackageGenerator.withPlugins()).getCreateSpec();
        expect(spec.createSchema).toBeDefined();
        expect(spec.elements).toBeDefined();
    });
    it('Loads additional plugins and returns create spec', async () => {
        const spec = (await CarePackageGenerator.withPlugins(['../CarePackageGenerator.spec/TestPlugin'])).getCreateSpec();
        expect(spec.createSchema).toBeDefined();
        expect(spec.elements).toBeDefined();
        expect(spec.elements).toBeDefined(jasmine.arrayContaining([new TestPlugin()]));
    });
    it('Generate with no plugins', async () => {
        const fs = jasmine.createSpyObj('fs', ['copyTpl', 'readJSON', 'writeJSON']);
        fs.readJSON.and.returnValue({
            elements: []
        });
        const generator = jasmine.createSpyObj('generator', ['sourceRoot', 'templatePath', 'destinationPath']);
        generator.fs = fs;
        const answers = {
            name: 'test',
            elements: {}
        };
        await (await CarePackageGenerator.withPlugins()).generate(generator, answers);
        expect(generator.sourceRoot).toHaveBeenCalledWith(path.join(__dirname, '..', 'templates'));
        expect(generator.templatePath).toHaveBeenCalled();
        expect(generator.destinationPath).toHaveBeenCalled();

        expect(generator.fs.readJSON).not.toHaveBeenCalled();
        expect(generator.fs.writeJSON).not.toHaveBeenCalled();
    });
    it('Generate with default plugins', async () => {
        const fs = jasmine.createSpyObj('fs', ['copyTpl', 'readJSON', 'writeJSON', 'extendJSON']);
        fs.readJSON.and.returnValue({
            elements: []
        });
        const generator = jasmine.createSpyObj('generator', ['sourceRoot', 'templatePath', 'destinationPath']);
        generator.fs = fs;
        const answers = {
            name: 'test',
            elements: {
                types: { name: 'types' },
                uiPlugin: { name: 'uiPlugin' }
            }
        };
        await (await CarePackageGenerator.withPlugins()).generate(generator, answers);
        expect(generator.sourceRoot).toHaveBeenCalledWith(path.join(__dirname, '..', 'templates'));
        expect(generator.templatePath).toHaveBeenCalled();
        expect(generator.destinationPath).toHaveBeenCalled();

        expect(generator.fs.extendJSON).toHaveBeenCalled();
    });
});
