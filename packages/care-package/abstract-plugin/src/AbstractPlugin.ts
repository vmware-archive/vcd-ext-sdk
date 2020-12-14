import { Schema } from 'ts-json-schema-generator';
import * as path from 'path';
import { sync as globSync } from 'glob';
import * as Generator from 'yeoman-generator';
import { CarePackageSourceSpec, Element, ElementSource, Plugin } from '@vcd/care-package-def';

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
        return path.join('packages', name)
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

            const eleSpec: Element = {
                name: ele.name,
                type: ele.type,
                configuration: ele.configuration,
                location: location
            }
            globSync(path.join(packageRoot, base, outDir, files))
                .forEach(file => {
                    const relativePath = path.dirname(
                        path.relative(path.join(packageRoot, base, outDir), file)
                    );
                    options.zip.addLocalFile(file, path.join(base, relativePath));
                });
            return eleSpec;
        })
        return Promise.resolve(elementSpecs);
    }
}
