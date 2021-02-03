import { JSONSchema7 } from 'json-schema';
import * as path from 'path';
import { sync as globSync } from 'glob';
import * as Generator from 'yeoman-generator';
import { BuildActionParameters, BuildActions, DeployActions, Element, ElementSource } from '@vcd/care-package-def';
import debug from 'debug';

const log = debug('vcd:ext:deployer');

export abstract class AbstractBuildActions implements BuildActions {

    abstract name: string;

    abstract getSrcRoot(): string;
    abstract getDefaultOutDir(): string;
    abstract getDefaultFiles(): string;
    abstract getDeployActions(): DeployActions;

    protected copyTemplate(folderName: string, generator: Generator, answers: any) {
        generator.sourceRoot(this.getSrcRoot());
        generator.fs.copyTpl(
            generator.templatePath('new'),
            generator.destinationPath(this.getDefaultBase(folderName)),
            answers,
            undefined,
            { globOptions: { dot: true } });
    }

    getDefaultBase(name): string {
        return path.join('packages', name);
    }

    getBaseRelative(element: ElementSource) {
        return element.location?.base || this.getDefaultBase(element.name);
    }

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

    generate(generator: Generator, answers: any) {
        const folderName = answers.elements[this.name].name || this.name;
        this.copyTemplate(folderName, generator, answers);
    }

    pack({ packageRoot, elements, options }: BuildActionParameters) {
        const elementSpecs: Element[] = elements.map(ele => {
            const base = this.getBaseRelative(ele);
            const outDir = ele.location?.outDir || this.getDefaultOutDir();
            const files = ele.location?.files || this.getDefaultFiles();
            let location = path.join(base, files);
            location = location.indexOf('./') === 0 ? location.substr(2) : location;

            globSync(path.join(packageRoot, base, outDir, files))
                .forEach(file => {
                    const relativePath = path.dirname(
                        path.relative(path.join(packageRoot, base, outDir), file)
                    );
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

    async deploy({ packageRoot, careSpec, elements, options }: BuildActionParameters) {

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
            options
        });
    }
}
