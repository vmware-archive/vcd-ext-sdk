import * as path from 'path';
import { AbstractPlugin, ComponentDeployer } from '@vcd/care-package-plugin-abstract';
import { Compiler } from '@vcd/ext-compiler';
import { CarePackageSourceSpec, ElementSource } from '@vcd/care-package-def';
import { TypesComponentDeployer } from './deploy';

export class TypesCarePackagePlugin extends AbstractPlugin {
    name = 'types';
    displayName = 'Defined Entities';

    getComponentDeployer(options: any): ComponentDeployer {
        return new TypesComponentDeployer(options.config);
    }

    getSrcRoot(): string {
        return path.join(__dirname, '..', 'templates');
    }
    getDefaultOutDir(): string {
        return 'lib';
    }
    getDefaultFiles(): string {
        return '**/*.json'
    }

    private buildElement(packageRoot: string, element: ElementSource) {
        const base = path.join(packageRoot, element.location?.base || path.join('packages', element.name));
        let opts = {
            rootDir: base,
            outDir: path.join(base, element.location?.outDir || 'lib')
        };
        if (element.configuration) {
            opts = {
                ...element.configuration,
                ...opts
            };
        }
        new Compiler(null, opts).compile();
    }

    async build(packageRoot: string, _: CarePackageSourceSpec, elements: ElementSource[]) {
        elements.forEach(ele => this.buildElement(packageRoot, ele));
        return Promise.resolve();
    }
}
