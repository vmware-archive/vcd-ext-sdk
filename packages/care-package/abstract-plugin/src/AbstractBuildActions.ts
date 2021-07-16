import { JSONSchema7 } from 'json-schema';
import * as path from 'path';
import * as Generator from 'yeoman-generator';
import { BuildActionParameters, BuildActions, DeployActions, Element, ElementSource } from '@vcd/care-package-def';
import debug from 'debug';
import { glob } from './glob';

const log = debug('vcd:ext:deployer');

/**
 * Provides default implementation for 'generate', 'pack' and 'deploy' actions
 */
export abstract class AbstractBuildActions implements BuildActions {

    /**
     * Short name of the plugin
     */
    abstract name: string;

    /**
     * Plugin 'templates' folder.
     */
    // TODO Rename to getTemplatesRoot
    abstract getSrcRoot(): string;

    /**
     * The default build artifacts output directory
     */
    abstract getDefaultOutDir(): string;

    /**
     * Returns a glob pattern which describes the element build artifacts
     */
    abstract getDefaultFiles(): string;

    /**
     * Reference to the deploy actions
     */
    abstract getDeployActions(): DeployActions;

    /**
     * Copies the new template to the element default directory
     * @param folderName - element destination folder
     * @param generator - yeoman generator
     * @param answers - user input answers
     */
    // TODO answers should use a type
    protected copyTemplate(folderName: string, generator: Generator, answers: any) {
        generator.sourceRoot(this.getSrcRoot());
        generator.fs.copyTpl(
            generator.templatePath('new'),
            generator.destinationPath(this.getDefaultBase(folderName)),
            answers,
            undefined,
            { globOptions: { dot: true } });
    }

    /**
     * Gets the path for a given element
     * @param name - element name
     */
    getDefaultBase(name): string {
        return path.join('packages', name);
    }

    /**
     * Gets element custom path
     * @param element - element source definition
     */
    getBaseRelative(element: ElementSource) {
        return element.location?.base || this.getDefaultBase(element.name);
    }

    /**
     * Gets user input schema for a specific action
     * @param action - element action
     */
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

    /**
     * Generates a new template for an element based on user input
     * @param generator - yoeman generator
     * @param answers - user input answers
     */
    generate(generator: Generator, answers: any) {
        const folderName = answers.elements[this.name].name || this.name;
        this.copyTemplate(folderName, generator, answers);
    }

    /**
     * Inserts all element artifacts into the CARE package archive. Based on the output directory and file pattern
     * configuration
     */
    pack({ packageRoot, elements, options }: BuildActionParameters) {
        const elementSpecs: Element[] = elements.map(ele => {
            const base = this.getBaseRelative(ele);
            const outDir = ele.location?.outDir || this.getDefaultOutDir();
            const files = ele.location?.files || this.getDefaultFiles();
            let location = path.join(base, files);
            location = location.indexOf('./') === 0 ? location.substr(2) : location;

            glob(path.join(packageRoot, base, outDir), files)
                .forEach(file => {
                    const relativePath = path.dirname(
                        path.relative(path.join(packageRoot, base, outDir), file)
                    );
                    console.log(`Adding file to package: ${file}`);
                    options.zip.addLocalFile(file, path.join(base, relativePath));
                });
            return {
                name: ele.name,
                type: ele.type,
                configuration: ele.configuration,
                location
            };
        });
        return Promise.resolve(elementSpecs);
    }

    /**
     * Transforms Source elements into Package elements and invokes deploy on deploy actions
     */
    async deploy({ packageRoot, careSpec, elements, clientConfig, options }: BuildActionParameters) {

        const packageElements: Element[] = elements.map(eleSrc => {
            const base = this.getBaseRelative(eleSrc);
            const outDir = eleSrc.location?.outDir || this.getDefaultOutDir();
            const files = eleSrc.location?.files || this.getDefaultFiles();
            const location = path.join(base, outDir, files);
            return {
                name: eleSrc.name,
                type: eleSrc.type,
                configuration: eleSrc.configuration,
                location
            } as Element;
        });
        return this.getDeployActions().deploy({
            packageRoot,
            careSpec: {
                ...careSpec,
                elements: packageElements
            },
            elements: packageElements,
            clientConfig,
            options
        });
    }
}
