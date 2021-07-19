import { JSONSchema7 } from 'json-schema';
import { DeployActionParameters, DeployActions, Element } from '@vcd/care-package-def';
import { ComponentDeployerConstructor } from './ComponentDeployer';
import debug from 'debug';

const log = debug('vcd:ext:deployer');

export abstract class AbstractDeployActions implements DeployActions {

    abstract getInputSchema(action: string): JSONSchema7;

    /**
     * Returns a constructor function of a ComponentDeployer
     * The implementation of ComponentDeployer returned by this constructor function, can deploy a single element
     */
    abstract getComponentDeployer(): ComponentDeployerConstructor;

    /**
     * Iterates over all solution elements and performs deploy action on each
     * If options.force == true it performs clean action on each solution element in reverse order, prior deploy.
     */
    async deploy({ packageRoot, elements, clientConfig, options }: DeployActionParameters) {

        log(`Deploying elements: ${JSON.stringify(elements, null, 2)}`);
        const DeployerConstructor = this.getComponentDeployer();
        const deployer = new DeployerConstructor(clientConfig, options);
        log(`Deploying with args force: ${options.force}`);
        if (options.force) {
            console.log('Force option set to true. Cleaning up...');
            await elements
                .reduceRight(async (prevPromise, ele) => {
                    await prevPromise;
                    return deployer.clean(packageRoot, ele.location).catch(console.error);
                }, Promise.resolve()).catch(console.error);
        }

        return elements
            .reduce(async (prevPromise: Promise<any>, ele: Element) => {
                await prevPromise;
                return deployer.deploy(packageRoot, ele.location).catch(console.error);
            }, Promise.resolve()).catch(console.error);
    }
}
