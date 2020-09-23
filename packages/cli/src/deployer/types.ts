import * as path from "path";
import * as fs from "fs";
import { sync as globSync } from "glob";
import { CloudDirectorConfig, DefinedEntityTypeApi, DefinedInterfaceBehaviorsApi, BehaviorAccess, BehaviorAccesses } from '@vcd/node-client';
import { ObjectDeployer } from './ObjectDeployer';

const getIdComponent = (det: any): string => {
    return `${det.vendor}:${det.nss}:${det.version}`
}

export class TypesDeployer implements ObjectDeployer {
    detApi: DefinedEntityTypeApi
    behApi: DefinedInterfaceBehaviorsApi

    constructor(
        private apiConfig: CloudDirectorConfig,
        private rootDir: string,
        private debug: (...args: any[]) => void
    ) {
        this.detApi = this.apiConfig.makeApiClient(DefinedEntityTypeApi)
        this.behApi = this.apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi)
    }

    private async traverse(visitor: (det: any, existingDet?: any) => Promise<any>) {
        const files = globSync(path.resolve(this.rootDir, 'lib', 'types', "**/*.json"))
        const serverEntities = await this.detApi.getDefinedEntityTypes(1, 100)
        const existingDets = serverEntities.body.values
            .reduce((prev: any, curr) => {
                prev[getIdComponent(curr)] = curr
                return prev
            }, {})
        this.debug(existingDets)
        return Promise.all(
            files.map(async file => {
                this.debug(`Loading defined entity type from file: ${file}`)
                const det = JSON.parse(fs.readFileSync(file).toString());
                const existingDet = existingDets[getIdComponent(det)]
                return visitor(det, existingDet).catch(e => this.debug(e))
            })
        )
    }

    async clean() {
        this.debug("Starting clean up of types")
        this.traverse(async (det, existingDet) => {
            if (existingDet) {
                this.debug(`Removing defined entity type ${det.name}`)
                return this.detApi.deleteDefinedEntityType(existingDet.id)
            }
            return Promise.resolve()
        })

    }

    async deploy() {
        this.debug("Starting deployment of types")
        this.traverse(async (det, existingDet) => {
            const values: BehaviorAccess[] = det.accessControls || []
            delete det.accessControls

            let typeResponse = null
            if (existingDet) {
                this.debug(`Defined entity type already exists. Updating...`)
                typeResponse = await this.detApi.updateDefinedEntityType(det, existingDet.id)
            } else {
                this.debug(`Creating new defined entity type ${det.name}`)
                typeResponse = await this.detApi.createDefinedEntityType(det)
            }
            if (values.length > 0) {
                const typeId = typeResponse.body.id
                const accessControls = new BehaviorAccesses();
                accessControls.values = values
                return this.behApi.setDefinedEntityTypeAccess(accessControls, typeId).catch(e => this.debug(e))    
            }
            return Promise.resolve();
        })
    }
}