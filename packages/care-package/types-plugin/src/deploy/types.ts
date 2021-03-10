import * as path from 'path';
import debug from 'debug';
import {
    CloudDirectorConfig,
    DefinedEntityTypeApi,
    DefinedInterfaceBehaviorsApi,
    BehaviorAccess,
    BehaviorAccesses
} from '@vcd/node-client';
import { BaseTypesDeployer } from './base';

const log = debug('vcd:ext:types-plugin:deploy:types');

export class TypesDeployer extends BaseTypesDeployer {
    detApi: DefinedEntityTypeApi;
    behApi: DefinedInterfaceBehaviorsApi;

    constructor(private apiConfig: CloudDirectorConfig) {
        super();
        this.detApi = this.apiConfig.makeApiClient(DefinedEntityTypeApi);
        this.behApi = this.apiConfig.makeApiClient(DefinedInterfaceBehaviorsApi);
    }

    protected log(...args: any) {
        log(args);
    }

    protected getServerEntities(): Promise<any> {
        return this.detApi.getDefinedEntityTypes(1, 100, '', '', '');
    }

    protected async cleanVisitor(det: any, existingDet: any) {
        if (existingDet) {
            log(`Removing defined entity type ${det.name}`);
            return this.detApi.deleteDefinedEntityType(existingDet.id);
        }
        return Promise.resolve();
    }

    protected async deployVisitor(det: any, existingDet: any) {
        const values: BehaviorAccess[] = det.accessControls || [];
        delete det.accessControls;

        let typeResponse = null;
        if (existingDet) {
            log(`Defined entity type ${det.name} already exists. Updating...`);
            typeResponse = await this.detApi.updateDefinedEntityType(det, existingDet.id);
        } else {
            log(`Creating new defined entity type ${det.name}`);
            typeResponse = await this.detApi.createDefinedEntityType(det);
        }
        if (values.length > 0) {
            const typeId = typeResponse.body.id;
            const accessControls = new BehaviorAccesses();
            accessControls.values = values;
            log(`\tCreating behavior access control ${JSON.stringify(accessControls)} on type ${det.name} ...`);
            return this.behApi.setDefinedEntityTypeAccess(accessControls, typeId).catch(log);
        }
        return Promise.resolve();
    }
    fileFilter(file: string): boolean {
        return file.split(path.sep).reverse().find(pathElement =>
            pathElement === 'types' || pathElement === 'interfaces') === 'types';
    }

    async clean(location: string, pattern: string) {
        log(`Cleaning up types defined at location: ${location}/${pattern}`);
        return this.traverse(location, pattern, this.fileFilter, this.cleanVisitor.bind(this));
    }

    async deploy(location: string, pattern: string) {
        log(`Deploying types defined at location: ${location}/${pattern}`);
        return this.traverse(location, pattern, this.fileFilter, this.deployVisitor.bind(this));
    }

}
