import { } from 'jasmine';
import * as path from 'path';
import { CarePackageGenerator } from './CarePackageGenerator';
import { AbstractPlugin } from '@vcd/care-package-plugin-abstract';

export class TestPlugin extends AbstractPlugin {
    name = 'test';
    module = '../CarePackageGenerator.spec/TestPlugin';
    displayName = 'Test Plugin';
    getDefaultOutDir(): string {
        throw new Error('Method not implemented.');
    }
    getDefaultFiles(): string {
        throw new Error('Method not implemented.');
    }
    getSrcRoot(): string {
        return 'test/root';
    }
}

describe('CarePackageGenerator Tests', () => {
    it('Loads plugins and returns create spec', async () => {
        const spec = (await CarePackageGenerator.withPlugins()).getCreateSpec();
        expect(spec.createSchema).toBeDefined();
        expect(spec.elements).toBeDefined();
        expect(spec.createSchema).toEqual(jasmine.objectContaining({
            properties: {
                name: {
                    type: 'string',
                    description: 'Your solution name'
                },
                version: {
                    type: 'string',
                    description: 'Specify first version',
                    default: '0.0.1'
                },
                vendor: {
                    type: 'string',
                    description: 'Specify vendor name'
                },
                link: {
                    type: 'string',
                    description: 'Specify vendor link',
                    default: 'http://example.com'
                },
                license: {
                    type: 'string',
                    description: 'Specify solution license',
                    default: 'BSD-2-Clause'
                }
            }
        }));
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
        const fs = jasmine.createSpyObj('fs', ['copyTpl', 'readJSON', 'writeJSON']);
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

        expect(generator.fs.readJSON).toHaveBeenCalled();
        expect(generator.fs.writeJSON).toHaveBeenCalled();
    });
});
