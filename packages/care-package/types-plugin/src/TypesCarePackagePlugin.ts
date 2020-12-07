import * as path from 'path';
import { AbstractPlugin } from '@vcd/care-package-plugins';
import { Compiler } from '@vcd/ext-compiler';

export class TypesCarePackagePlugin extends AbstractPlugin {
    name = 'types';
    displayName = 'Defined Entities';

    getSrcRoot(): string {
        return path.join(__dirname, '..', 'templates');
    }

    async build(packageRoot: string, _: any, element: any) {
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
        return new Compiler(null, opts).compile();
    }
}
