import * as path from 'path';
import * as debug from 'debug';
import { CloudDirectorConfig, DefinedInterfaceApi, DefinedInterfaceBehaviorsApi } from '@vcd/node-client';
import { BaseTypesDeployer } from './base';

const log = debug('vcd:ext:deployer:interfaces')

const getIdComponent = (det: any): string => {
    return `${det.vendor}:${det.nss}:${det.version}`
}

export class InterfacesDeployer extends BaseTypesDeployer {
    intApi: DefinedInterfaceApi
    behApi: DefinedInterfaceBehaviorsApi

    constructor(private apiConfig: CloudDirectorConfig) {
        super()
        this.intApi = this.apiConfig.makeApiClient(DefinedInterfaceApi)
        this.behApi = this.apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi)
    }

    protected log(...args: any) {
        log(args)
    }

    protected getServerEntities(): Promise<any> {
        return this.intApi.queryInterfaces(1, 100)
    }
    protected async cleanVisitor(definedInterface: any, existingInt: any) {
        if (!existingInt) {
            return Promise.resolve()
        }
        log(`Interface exists ${definedInterface.name}. Cleaning up behaviours`)
        const serverBehs = await this.behApi.getInterfaceBehaviors(1, 128, existingInt.id)
        await Promise.all(serverBehs.body.values.map(
            async beh => {
                log(`Removing behaviour ${beh.name}`)
                return this.behApi.deleteInterfaceBehavior(existingInt.id, beh.id).catch(e => log(e))
            }
        ))
        log(`Removing interface ${definedInterface.name}`)
        return this.intApi.deleteInterface(existingInt.id)

    }

    protected async deployVisitor(definedInterface: any, existingInt: any) {
        const behaviors: any[] = definedInterface.behaviors
        delete definedInterface.behaviors

        let interfaceResponse = null
        if (existingInt) {
            log(`Defined interface already exists. Updating...`)
            interfaceResponse = await this.intApi.updateInterface(definedInterface, existingInt.id)
        } else {
            log(`Creating new defined interface ${definedInterface.name}`)
            interfaceResponse = await this.intApi.createInterface(definedInterface)
        }
        const intId = interfaceResponse.body.id
        const serverBehs = await this.behApi.getInterfaceBehaviors(1, 128, intId)
        const exisingBehs = serverBehs.body.values
            .reduce((prev: any, curr) => {
                prev[curr.name] = curr
                return prev
            }, {})
        log(exisingBehs)
        return Promise.all(behaviors.map(async beh => {
            if (exisingBehs[beh.name]) {
                log('\t Behavior already exists on interface. Updating ...')
                return this.behApi.updateInterfaceBehavior(beh, intId, exisingBehs[beh.name].id).catch(e => log(e))
            }
            log('\t Creating behavior on interface ...')
            return this.behApi.addInterfaceBehavior(beh, intId).catch(e => log(e))
        }))
    }
    fileFilter(file: string): boolean {
        return file.split(path.sep).reverse().find(pathElement => 
            pathElement === "types" || pathElement === "interfaces") === 'interfaces'
    }

    async clean(location: string) {
        this.log("Starting clean up")
        return this.traverse(location, this.fileFilter, this.cleanVisitor.bind(this))
    }

    async deploy(location: string) {
        this.log("Starting deployment")
        return this.traverse(location, this.fileFilter, this.deployVisitor.bind(this))
    }

}