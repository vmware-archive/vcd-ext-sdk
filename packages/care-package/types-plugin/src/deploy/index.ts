import debug from 'debug';

import { CloudDirectorConfig } from '@vcd/node-client';
import { ComponentDeployer } from '@vcd/care-package-plugin-abstract';
import { InterfacesDeployer } from './interfaces';
import { TypesDeployer } from './types';

const log = debug('vcd:ext:types-plugin:deploy:base');


export class TypesComponentDeployer implements ComponentDeployer {
    objectDeployers: ComponentDeployer[];

    constructor(private apiConfig: CloudDirectorConfig) {
        this.objectDeployers = [
            new InterfacesDeployer(this.apiConfig),
            new TypesDeployer(this.apiConfig)
        ];
    }

    async deploy(location: string, pattern: string): Promise<any> {
        return this.objectDeployers
            .reduce(async (prevPromise, od) => {
                await prevPromise;
                return od.deploy(location, pattern).catch(console.error);
            }, Promise.resolve()).catch(console.error);
    }
    async clean(location: string, pattern: string) {
        return this.objectDeployers
            .reduceRight(async (prevPromise, od) => {
                await prevPromise;
                return od.clean(location, pattern).catch(console.error);
            }, Promise.resolve()).catch(console.error);
    }
}
