import { CloudDirectorConfig } from '@vcd/node-client';
import { TypesDeployer } from './types';
import { InterfacesDeployer } from './interfaces';
import { ObjectDeployer } from './ObjectDeployer';

export class Deployer {
    objectDeployers: ObjectDeployer[]

    constructor(private apiConfig: CloudDirectorConfig, private force: boolean, private debug: (...args: any[]) => void) {
        this.objectDeployers = [
            new InterfacesDeployer(this.apiConfig, process.cwd(), debug),
            new TypesDeployer(this.apiConfig, process.cwd(), debug)
        ]
    }

    async deploy() {
        process.on('unhandledRejection', (reason, p) => {
            this.debug('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });

        if (this.force) {
            this.debug("Force option set to true. Cleaning up...")
            await this.objectDeployers.reverse().reduce(async (prevPromise, od) => {
                await prevPromise;
                return od.clean().catch(e => this.debug(e))
            }, Promise.resolve()).catch(e => this.debug(e))
        }
        return this.objectDeployers.reduce(async (prevPromise, od) => {
            await prevPromise
            return od.deploy().catch(e => this.debug(e))
        }, Promise.resolve()).catch(e => this.debug(e))
    }
}