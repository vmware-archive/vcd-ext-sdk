import * as debug from 'debug';
import { CloudDirectorConfig, DefinedEntityTypeApi, DefinedInterfaceBehaviorsApi, BehaviorAccess, BehaviorAccesses } from '@vcd/node-client';
import { BaseTypesDeployer } from './base';

const log = debug('vcd:ext:deployer:types')

export class TypesDeployer extends BaseTypesDeployer {
    detApi: DefinedEntityTypeApi
    behApi: DefinedInterfaceBehaviorsApi

    constructor(private apiConfig: CloudDirectorConfig) {
        super();
        this.detApi = this.apiConfig.makeApiClient(DefinedEntityTypeApi)
        this.behApi = this.apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi)
    }

    protected log(...args: any) {
        log(args)
    } 

    protected getServerEntities(): Promise<any> {
        return this.detApi.getDefinedEntityTypes(1, 100)
    }

    protected async cleanVisitor(det: any, existingDet: any) {
        if (existingDet) {
            log(`Removing defined entity type ${det.name}`)
            return this.detApi.deleteDefinedEntityType(existingDet.id)
        }
        return Promise.resolve()
    }

    protected async deployVisitor(det: any, existingDet: any) {
        const values: BehaviorAccess[] = det.accessControls || []
        delete det.accessControls

        let typeResponse = null
        if (existingDet) {
            log(`Defined entity type already exists. Updating...`)
            typeResponse = await this.detApi.updateDefinedEntityType(det, existingDet.id)
        } else {
            log(`Creating new defined entity type ${det.name}`)
            typeResponse = await this.detApi.createDefinedEntityType(det)
        }
        if (values.length > 0) {
            const typeId = typeResponse.body.id
            const accessControls = new BehaviorAccesses();
            accessControls.values = values
            return this.behApi.setDefinedEntityTypeAccess(accessControls, typeId).catch(e => log(e))
        }
        return Promise.resolve();
    }
    fileFilter(file: string): boolean {
        return file.indexOf('types/') > -1
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