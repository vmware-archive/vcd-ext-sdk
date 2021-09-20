import * as path from 'path';
import * as Generator from 'yeoman-generator';
import camelcase from 'camelcase';
import PluginLoader, { PluginExtended } from './plugins/PluginLoader';
import { createSchema } from './createSchema';

/**
 * Describes the CARE package solution generation
 */
export interface CarePackageCreateSpec {
    /**
     * Defines the schema for the input required to generate a CARE package solution project
     */
    createSchema: any;

    /**
     * List of plugins to be used for generating the solution project
     */
    elements: PluginExtended[];
}

/**
 * Generate the CARE package solution project
 */
export class CarePackageGenerator {

    /**
     * @param plugins - List of plugins to be used for generating the solution project
     */
    private constructor(private plugins: PluginExtended[]) {
    }

    /**
     * Creates an instance of CarePackageGenerator with custom plugins
     * @param additionalPlugins - A list of custom plugins
     */
    static async withPlugins(additionalPlugins: string[] = []) {
        const plugins = await PluginLoader.loadWithDefaults(additionalPlugins);
        return new CarePackageGenerator(plugins);
    }

    /**
     * Creates an instance of CarePackageCreateSpec
     */
    getCreateSpec(): CarePackageCreateSpec {
        return {
            createSchema,
            elements: this.plugins
        };
    }

    /**
     * Generates a CARE package solution
     * @param generator - yeoman generator
     * @param answers - the user answers used to generate the solution
     */
    // TODO Revisit answers: any object and if a type can be defined
    async generate(generator: Generator, answers: any) {
        // TODO extract 'templates' as a const variable
        generator.sourceRoot(path.join(__dirname, '..', 'templates'));
        answers.nameCamelCase = camelcase(answers.name, { pascalCase: true });
        answers.careElements = Object
            .keys(answers.elements)
            .map(pluginName => {
                const ele = answers.elements[pluginName];
                const plugin = this.plugins.find(p => p.name === pluginName);
                return {
                    name: ele.name || plugin.name,
                    type: plugin.module,
                    configuration: plugin.buildActions.getConfiguration ? plugin.buildActions.getConfiguration(ele) : undefined
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
            .filter(plugin => !!plugin.buildActions.generate && !!answers.elements[plugin.name])
            .forEach(plugin => plugin.buildActions.generate(generator, answers));
    }
}
