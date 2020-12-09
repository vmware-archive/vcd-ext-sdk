import { Schema } from 'ts-json-schema-generator';
import * as path from 'path';
import * as Generator from 'yeoman-generator';
import { Plugin } from '@vcd/care-package-def';

export abstract class AbstractPlugin implements Plugin {
    module: string;
    abstract name: string;
    abstract displayName: string;

    createSchema: Schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'element name'
            }
        }
    };

    abstract getSrcRoot(): string;

    protected copyTemplate(folderName: string, generator: Generator, answers: any) {
        generator.sourceRoot(this.getSrcRoot());
        generator.fs.copyTpl(
            generator.templatePath('new'),
            generator.destinationPath('packages', folderName),
            answers,
            undefined,
            { globOptions: { dot: true } });
    }

    generate(generator: Generator, answers: any) {
        const folderName = answers.elements[this.name].name || this.name;
        this.copyTemplate(folderName, generator, answers);
    }
}
