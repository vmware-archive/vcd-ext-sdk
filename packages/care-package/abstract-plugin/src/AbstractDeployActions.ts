import { JSONSchema7 } from 'json-schema';
import * as path from 'path';
import { DeployActionParameters, DeployActions, Element } from '@vcd/care-package-def';
import { ComponentDeployer } from './ComponentDeployer';
import debug from 'debug';

const log = debug('vcd:ext:deployer');

export abstract class AbstractDeployActions implements DeployActions {

    abstract getInputSchema(action: string): JSONSchema7;
    abstract getComponentDeployer(options: any): ComponentDeployer;

    async deploy({ packageRoot, elements, options }: DeployActionParameters) {

        log(`Deploying elements: ${JSON.stringify(elements, null, 2)}`);
        const deployer = this.getComponentDeployer(options);
        log(`Deploying with args force: ${options.force}`);
        if (options.force) {
            console.log('Force option set to true. Cleaning up...');
            await elements
                .reduceRight(async (prevPromise, ele) => {
                    await prevPromise;
                    return deployer.clean(path.join(packageRoot, ele.location)).catch(console.error);
                }, Promise.resolve()).catch(console.error);
        }
        return (elements as Element[])
            .reduce(async (prevPromise: Promise<any>, ele: Element) => {
                await prevPromise;
                return deployer.deploy(path.join(packageRoot, ele.location)).catch(console.error);
            }, Promise.resolve()).catch(console.error);
    }
}
