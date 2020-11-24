import * as debug from 'debug';

import { CloudDirectorConfig } from '@vcd/node-client';
import { ComponentDeployer } from '../ComponentDeployer';
import { InterfacesDeployer } from './interfaces';
import { TypesDeployer } from './types';

const log = debug('vcd:ext:deployer:typesbase');


export class TypesComponentDeployer implements ComponentDeployer {
    objectDeployers: ComponentDeployer[];

    constructor(private apiConfig: CloudDirectorConfig) {
        this.objectDeployers = [
            new InterfacesDeployer(this.apiConfig),
            new TypesDeployer(this.apiConfig)
        ];
    }

    async deploy(location: string): Promise<any> {
        return this.objectDeployers.reduce(async (prevPromise, od) => {
            await prevPromise;
            return od.deploy(location).catch(e => log(e));
        }, Promise.resolve()).catch(e => log(e));
    }
    async clean(location: string) {
        return this.objectDeployers.reverse().reduce(async (prevPromise, od) => {
            await prevPromise;
            return od.clean(location).catch(e => log(e));
        }, Promise.resolve()).catch(e => log(e));
    }

}
