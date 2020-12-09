import * as path from 'path';
import { AbstractPlugin } from '@vcd/care-package-plugin-abstract';
import { Compiler } from '@vcd/ext-compiler';
import { CarePackageSourceSpec, ElementSource } from '@vcd/care-package-def';

export class TypesCarePackagePlugin extends AbstractPlugin {
    name = 'types';
    displayName = 'Defined Entities';

    getSrcRoot(): string {
        return path.join(__dirname, '..', 'templates');
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
