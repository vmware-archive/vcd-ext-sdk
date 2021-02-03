import * as path from 'path';
import { AbstractBuildActions } from '@vcd/care-package-plugin-abstract';
import { Compiler } from '@vcd/ext-compiler';
import * as careDef from '@vcd/care-package-def';
import { DeployActions } from './DeployActions';
import { names } from './names';

export class BuildActions extends AbstractBuildActions {
    name = names.name;
    getDeployActions(): careDef.DeployActions {
        return new DeployActions();
    }

    getSrcRoot(): string {
        return path.join(__dirname, '..', 'templates');
    }
    getDefaultOutDir(): string {
        return 'lib';
    }
    getDefaultFiles(): string {
        return '**/*.json';
    }

    private buildElement(packageRoot: string, element: careDef.ElementSource, options: any = {}) {
        const base = path.join(packageRoot, element.location?.base || path.join('packages', element.name));
        let opts = {
            rootDir: base,
            outDir: path.join(base, element.location?.outDir || 'lib')
        };
        if (element.configuration) {
            opts = {
                ...opts,
                ...element.configuration,
                ...options
            };
        }
        new Compiler(null, opts).compile();
    }

    async build({ packageRoot, elements, options }: careDef.BuildActionParameters) {
        elements.forEach(ele => this.buildElement(packageRoot, ele, options));
        return Promise.resolve();
    }
}
