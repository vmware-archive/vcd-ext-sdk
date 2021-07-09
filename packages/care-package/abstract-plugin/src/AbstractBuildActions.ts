import * as path from 'path';
import { BuildActionParameters, BuildActions, DeployActions, Element, ElementSource } from '@vcd/care-package-def';
import { glob } from './glob';

export abstract class AbstractBuildActions implements BuildActions {

    abstract name: string;

    abstract getDefaultOutDir(): string;
    abstract getDefaultFiles(): string;
    abstract getDeployActions(): DeployActions;

    getDefaultBase(name): string {
        return path.join('packages', name);
    }

    getBaseRelative(element: ElementSource) {
        return element.location?.base || this.getDefaultBase(element.name);
    }

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
