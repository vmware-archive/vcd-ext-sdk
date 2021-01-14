import { Schema } from 'ts-json-schema-generator';
import * as path from 'path';
import { sync as globSync } from 'glob';
import * as Generator from 'yeoman-generator';
import { CarePackageSourceSpec, CarePackageSpec, Element, ElementBase, ElementSource, Plugin } from '@vcd/care-package-def';
import { ComponentDeployer } from './ComponentDeployer';
import debug from 'debug';

const log = debug('vcd:ext:deployer');

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
    abstract getDefaultOutDir(): string;
    abstract getDefaultFiles(): string;
    abstract getComponentDeployer(options: any): ComponentDeployer;

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

    generate(generator: Generator, answers: any) {
        const folderName = answers.elements[this.name].name || this.name;
        this.copyTemplate(folderName, generator, answers);
    }

    pack(packageRoot: string, _: CarePackageSourceSpec, elements: ElementSource[], options) {
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

    async deploy(packageRoot: string, _: CarePackageSpec, srcElements: (Element | ElementSource)[], options) {

        const elements: Element[] = srcElements.map(ele => {
            if (typeof(ele.location) === 'string') {
                return ele as Element;
            }
            const eleSrc = ele as ElementSource;
            const base = this.getBaseRelative(eleSrc);
            const outDir = eleSrc.location?.outDir || this.getDefaultOutDir();
            const files = eleSrc.location?.files || this.getDefaultFiles();
            const location = path.join(base, outDir, files);
            return {
                name: ele.name,
                type: ele.type,
                configuration: ele.configuration,
                location
            } as Element;
        });
        log(`Deploying elements: ${JSON.stringify(elements, null, 2)}`);
        const deployer = this.getComponentDeployer(options);
        log(`Deploying with args force: ${options.force}`);
        if (options.force) {
            console.log('Force option set to true. Cleaning up...');
            await elements
                .reduceRight(async (prevPromise, ele) => {
                    await prevPromise;
                    return deployer.clean(path.join(packageRoot, ele.location)).catch(console.error);
                }, Promise.resolve()).catch(console.error);
        }
        return (elements as Element[])
            .reduce(async (prevPromise: Promise<any>, ele: Element) => {
                await prevPromise;
                return deployer.deploy(path.join(packageRoot, ele.location)).catch(console.error);
            }, Promise.resolve()).catch(console.error);
    }
}
