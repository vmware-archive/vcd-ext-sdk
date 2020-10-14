import * as path from 'path';
import * as debug from 'debug';

import { CloudDirectorConfig } from '@vcd/node-client';
import { TypesComponentDeployer } from './types';
import { ComponentDeployer } from './ComponentDeployer';
import { CarePackage, CarePackageSource, Element } from '../care';
import { UIPluginComponentDeployer } from './uiPlugin';

const log = debug('vcd:ext:deployer')

export class Deployer {
    objectDeployers: { [componentType: string]: ComponentDeployer }

    constructor(private apiConfig: CloudDirectorConfig, private force: boolean, private only: string[] | null) {
        this.objectDeployers = {
            types: new TypesComponentDeployer(this.apiConfig),
            uiPlugin: new UIPluginComponentDeployer(this.apiConfig)
        }
    }

    async deploy(carePackage: CarePackage | CarePackageSource) {
        process.on('unhandledRejection', (reason, p) => {
            log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here
        });

        log(`Deploying with args force: ${this.force}; only: ${this.only}`)
        if (this.force) {
            log("Force option set to true. Cleaning up...")
            await carePackage.elements
                .filter(ele => !this.only || this.only.indexOf(ele.location.split(path.sep)[1]) > -1)
                .reverse()
                .reduce(async (prevPromise, ele) => {
                    await prevPromise;
                    return this.objectDeployers[ele.type].clean(path.join(carePackage.packageRoot, ele.location)).catch(e => log(e))
                }, Promise.resolve()).catch(e => log(e))
        }
        return (carePackage.elements as Element[])
            .filter(ele => !this.only || this.only.indexOf(ele.location.split(path.sep)[1]) > -1)
            .reduce(async (prevPromise: Promise<any>, ele: Element) => {
                await prevPromise;
                return this.objectDeployers[ele.type].deploy(path.join(carePackage.packageRoot, ele.location)).catch(e => log(e))
            }, Promise.resolve()).catch(e => log(e))
    }
}