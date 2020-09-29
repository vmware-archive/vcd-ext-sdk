import * as path from "path";
import * as fs from "fs";
import { sync as globSync } from "glob";
import { CloudDirectorConfig, DefinedInterfaceApi, DefinedInterfaceBehaviorsApi } from '@vcd/node-client';
import { ObjectDeployer } from './ObjectDeployer';

const getIdComponent = (det: any): string => {
    return `${det.vendor}:${det.nss}:${det.version}`
}

export class InterfacesDeployer implements ObjectDeployer {
    intApi: DefinedInterfaceApi
    behApi: DefinedInterfaceBehaviorsApi

    constructor(private apiConfig: CloudDirectorConfig, private rootDir: string, private debug: (...args: any[]) => void) {
        this.intApi = this.apiConfig.makeApiClient(DefinedInterfaceApi)
        this.behApi = this.apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi)
    }

    private async traverse(visitor: (definedInterface: any, existingInt?: any) => Promise<any>) {
        const files = globSync(path.resolve(this.rootDir, 'lib', 'interfaces', "**/*.json"))
        const serverEntities = await this.intApi.queryInterfaces(1, 100)
        const existingInts = serverEntities.body.values
            .reduce((prev: any, curr) => {
                prev[getIdComponent(curr)] = curr
                return prev
            }, {})
        this.debug(existingInts)
        return Promise.all(
            files.map(async file => {
                this.debug(`Loading defined interface from file: ${file}`)
                const definedInterface = JSON.parse(fs.readFileSync(file).toString());
                const existing = existingInts[getIdComponent(definedInterface)]

                return visitor(definedInterface, existing).catch(e => this.debug(e))
            })
        )
    }

    async clean() {
        this.debug("Starting clean up of interfaces")
        return this.traverse(async (definedInterface, existingInt) => {
            if (!existingInt) {
                return Promise.resolve()
            }
            this.debug(`Interface exists ${definedInterface.name}. Cleaning up behaviours`)
            const serverBehs = await this.behApi.getInterfaceBehaviors(1, 128, existingInt.id)
            await Promise.all(serverBehs.body.values.map(
                async beh => {
                    this.debug(`Removing behaviour ${beh.name}`)
                    return this.behApi.deleteInterfaceBehavior(existingInt.id, beh.id).catch(e => this.debug(e))
                }
            ))
            this.debug(`Removing interface ${definedInterface.name}`)
            return this.intApi.deleteInterface(existingInt.id)
        })
    }

    async deploy() {
        this.debug("Starting deployment of interfaces and behaviours")
        return this.traverse(async (definedInterface, existingInt) => {
            const behaviors: any[] = definedInterface.behaviors
            delete definedInterface.behaviors

            let interfaceResponse = null
            if (existingInt) {
                this.debug(`Defined interface already exists. Updating...`)
                interfaceResponse = await this.intApi.updateInterface(definedInterface, existingInt.id)
            } else {
                this.debug(`Creating new defined interface ${definedInterface.name}`)
                interfaceResponse = await this.intApi.createInterface(definedInterface)
            }
            const intId = interfaceResponse.body.id
            const serverBehs = await this.behApi.getInterfaceBehaviors(1, 128, intId)
            const exisingBehs = serverBehs.body.values
                .reduce((prev: any, curr) => {
                    prev[curr.name] = curr
                    return prev
                }, {})
            this.debug(exisingBehs)
            return Promise.all(behaviors.map(async beh => {
                if (exisingBehs[beh.name]) {
                    this.debug('\t Behavior already exists on interface. Updating ...')
                    return this.behApi.updateInterfaceBehavior(beh, intId, exisingBehs[beh.name].id).catch(e => this.debug(e))
                }
                this.debug('\t Creating behavior on interface ...')
                return this.behApi.addInterfaceBehavior(beh, intId).catch(e => this.debug(e))
            }))
        })
    }
}