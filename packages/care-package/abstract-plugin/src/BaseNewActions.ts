import {NewActions, Plugin} from '@vcd/care-package-def';
import {JSONSchema7} from 'json-schema';
import * as Generator from 'yeoman-generator';
import * as path from 'path';
import * as fs from 'fs';

export class BaseNewActions implements NewActions {

    getInputSchema(action: string): JSONSchema7 {
        if (action === 'generate') {
            return {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'element name'
                    }
                }
            };
        }
        return null;
    }

    generate(plugin: Plugin, generator: Generator, answers: any) {
        const srcRoot = path.join(plugin.workingDirectory(), '..', 'templates');
        if (!fs.existsSync(srcRoot)) {
            return;
        }

        const name = answers.elements[plugin.name].name || plugin.name;

        generator.sourceRoot(srcRoot);
        const templatePath = generator.templatePath('new');
        const destinationPath = generator.destinationPath('packages', name);

        generator.fs.copyTpl(
            templatePath,
            destinationPath,
            answers,
            undefined,
            { globOptions: { dot: true } });
    }
}
