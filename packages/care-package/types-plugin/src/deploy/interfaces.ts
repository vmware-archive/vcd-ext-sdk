import * as path from 'path';
import debug from 'debug';
import { CloudDirectorConfig, DefinedInterfaceApi, DefinedInterfaceBehaviorsApi } from '@vcd/node-client';
import { BaseTypesDeployer } from './base';

const log = debug('vcd:ext:types-plugin:deploy:interfaces');

export class InterfacesDeployer extends BaseTypesDeployer {
    intApi: DefinedInterfaceApi;
    behApi: DefinedInterfaceBehaviorsApi;

    constructor(private apiConfig: CloudDirectorConfig) {
        super();
        this.intApi = this.apiConfig.makeApiClient(DefinedInterfaceApi);
        this.behApi = this.apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi);
    }

    protected log(...args: any) {
        log(args);
    }

    protected getServerEntities(): Promise<any> {
        return this.intApi.queryInterfaces(1, 100);
    }
    protected async cleanVisitor(definedInterface: any, existingInt: any) {
        if (!existingInt) {
            return Promise.resolve();
        }
        console.log(`Interface exists ${definedInterface.name}. Cleaning up behaviours`);
        const serverBehs = await this.behApi.getInterfaceBehaviors(1, 128, existingInt.id);
        await Promise.all(serverBehs.body.values.map(
            async beh => {
                console.log(`Removing behaviour ${beh.name}`);
                return this.behApi.deleteInterfaceBehavior(existingInt.id, beh.id).catch(console.error);
            }
        ));
        console.log(`Removing interface ${definedInterface.name}`);
        return this.intApi.deleteInterface(existingInt.id);

    }

    protected async deployVisitor(definedInterface: any, existingInt: any) {
        const behaviors: any[] = definedInterface.behaviors;
        delete definedInterface.behaviors;

        let interfaceResponse = null;
        if (existingInt) {
            console.log(`Interface exists ${definedInterface.name}. Updating ...`);
            interfaceResponse = await this.intApi.updateInterface(definedInterface, existingInt.id);
        } else {
            console.log(`Creating new defined interface ${definedInterface.name}`);
            interfaceResponse = await this.intApi.createInterface(definedInterface);
        }
        const intId = interfaceResponse.body.id;
        const serverBehs = await this.behApi.getInterfaceBehaviors(1, 128, intId);
        const exisingBehs = serverBehs.body.values
            .reduce((prev: any, curr) => {
                prev[curr.name] = curr;
                return prev;
            }, {});
        log(exisingBehs);
        return Promise.all(behaviors.map(async beh => {
            if (exisingBehs[beh.name]) {
                console.log(`\t Behavior already exists ${beh.name}. Updating ...`);
                return this.behApi.updateInterfaceBehavior(beh, intId, exisingBehs[beh.name].id).catch(console.error);
            }
            console.log(`\t Creating behavior ${beh.name} on interface ${definedInterface.name} ...`);
            return this.behApi.addInterfaceBehavior(beh, intId).catch(console.error);
        }));
    }
    fileFilter(file: string): boolean {
        return file.split(path.sep).reverse().find(pathElement =>
            pathElement === 'types' || pathElement === 'interfaces') === 'interfaces';
    }

    async clean(location: string) {
        console.log(`Cleaning up interfaces defined at location: ${location}`);
        return this.traverse(location, this.fileFilter, this.cleanVisitor.bind(this));
    }

    async deploy(location: string) {
        console.log(`Deploying interfaces defined at location: ${location}`);
        return this.traverse(location, this.fileFilter, this.deployVisitor.bind(this));
    }

}
