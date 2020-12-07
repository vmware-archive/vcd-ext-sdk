import * as path from 'path';
import * as Generator from 'yeoman-generator';
import camelcase from 'camelcase';
import PluginLoader from './plugins/PluginLoader';
import { Schema } from 'ts-json-schema-generator';
import { Plugin } from '@vcd/care-package-plugins';
import { createSchema } from './createSchema';

export interface CarePackageCreateSpec {
    createSchema: Schema;
    elements: Plugin[];
}

export class CarePackageGenerator {

    private constructor(private plugins: Plugin[]) {
    }

    static async withPlugins(additionalPlugins: string[] = []) {
        const plugins = await PluginLoader.loadWithDefaults(additionalPlugins);
        return new CarePackageGenerator(plugins);
    }

    getCreateSpec(): CarePackageCreateSpec {
        return {
            createSchema,
            elements: this.plugins
        };
    }

    async generate(generator: Generator, answers: any) {
        generator.sourceRoot(path.join(__dirname, '..', 'templates'));
        answers.nameCamelCase = camelcase(answers.name, { pascalCase: true });
        answers.careElements = Object.keys(answers.elements).map(pluginName => {
            const ele = answers.elements[pluginName];
            const plugin = this.plugins.find(p => p.name === pluginName);
            return {
                name: ele.name || plugin.name,
                type: plugin.module
            };
        });
        generator.fs.copyTpl(
            generator.templatePath('new'),
            generator.destinationPath(),
            answers,
            undefined,
            { globOptions: { dot: true } }
        );
        this.plugins
            .filter(plugin => !!plugin.generate && !!answers.elements[plugin.name])
            .forEach(plugin => plugin.generate(generator, answers));
    }
}
