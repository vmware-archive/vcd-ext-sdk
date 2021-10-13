import {
    CloudDirectorConfig,
    DefinedEntityApi,
    DefinedEntityTypeApi,
    OrgApi,
    OrgVdcNetworksApi,
    VdcApi
} from '@vcd/node-client';
import {
    QueryResultOrgVdcStorageProfileRecordType,
    QueryResultRecordsType
} from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import debug from 'debug';

const log = debug('vcd:ext:provider-org-interface');

export interface BaseStruct {
    id: string;
    name: string;
    capabilities: string[];
}

export interface VDC extends BaseStruct {
    networks: BaseStruct[];
    securityGroups: BaseStruct[];
    storagePolicies: BaseStruct[];
    computePolicies: BaseStruct[];
}

export interface ProviderOrgInterface {
    organization: {
        id: string;
        name: string;
        capabilities: string[];
        vdcs: VDC[];
    };
}

export class ProviderOrg {

    apiConfig: CloudDirectorConfig;

    constructor(apiConfig: CloudDirectorConfig) {
        this.apiConfig = apiConfig;
    }

    private static async getOrg(apiConfig: CloudDirectorConfig, urn: string) {
        const orgApi = apiConfig.makeApiClient(OrgApi);
        const org = await orgApi.getOrg(urn);
        if (!org) {
            throw new Error(`Unable to retrieve Organization with id: ${urn}`);
        }
        console.log(`Organization: "${org.body.name}" found.`);
        return org.body.name;
    }

    private static async getVdcs(providerOrgApiConfig: CloudDirectorConfig, vdcs: BaseStruct[]) {
        const vdcApi = providerOrgApiConfig.makeApiClient(VdcApi);
        const filter = vdcs.map(entry => 'id==' + entry.id).join(',');
        const orgVdcs = await vdcApi.queryVdcs(1, 128, filter);
        if (!orgVdcs) {
            throw new Error('Unable to retrieve VDCs');
        }
        return orgVdcs.body.values;
    }

    private static async getNetworks(providerOrgApiConfig: CloudDirectorConfig, networks: BaseStruct[]) {
        const orgVdcNetworksApi = providerOrgApiConfig.makeApiClient(OrgVdcNetworksApi);
        const filter = networks.map(entry => 'id==' + entry.id).join(',');
        const orgVdcNetworks = await orgVdcNetworksApi.getAllVdcNetworks(1, 128, filter);
        if (!orgVdcNetworks) {
            throw new Error('Unable to retrieve vdc networks');
        }
        return orgVdcNetworks.body.values;
    }

    private static async getStoragePolicies(providerOrgApiConfig: CloudDirectorConfig, orgVdcStorageProfiles: BaseStruct[]) {
        const legacyApiClient = providerOrgApiConfig.makeLegacyApiClient();
        const filter = orgVdcStorageProfiles.map(entry => 'id==' + entry.id).join(',');
        const path = '/api/query?type=orgVdcStorageProfile&filter=' + filter;
        const vdcStorageProfiles = await legacyApiClient.get<QueryResultRecordsType>(path);
        if (!vdcStorageProfiles) {
            throw new Error('Unable to retrieve storage profiles');
        }
        return vdcStorageProfiles.record as QueryResultOrgVdcStorageProfileRecordType[];
    }

    public async getProviderOrgInterface(): Promise<ProviderOrgInterface> {
        log('Getting ProviderOrg Interface');
        const definedEntityTypeApiClient = this.apiConfig.makeApiClient(DefinedEntityTypeApi);
        const definedEntityTypes = await definedEntityTypeApiClient
            .getDefinedEntityTypes(1, 1, 'nss==solutions_organization_provider', '', 'version');
        const definedEntityType = definedEntityTypes.body.values.pop();

        if (!definedEntityType) {
            throw new Error('Provider Organization Interface is not configured.');
        }
        log('DefinedEntityType of ProviderOrg Interface found.');

        const definedEntityTypeClient = this.apiConfig.makeApiClient(DefinedEntityApi);
        const definedEntities = await definedEntityTypeClient.getDefinedEntitiesByEntityType(
            definedEntityType.vendor,
            definedEntityType.nss,
            definedEntityType.version,
            1,
            1);

        if (!definedEntities) {
            throw new Error('Provider Organization Interface is not configured.');
        }
        log('DefinedEntity of ProviderOrg Interface found.');

        const definedEntity = definedEntities.body.values.pop();
        const providerOrgInterface = definedEntity.entity as ProviderOrgInterface;
        providerOrgInterface.organization.name = await ProviderOrg.getOrg(this.apiConfig, providerOrgInterface.organization.id);

        const providerOrgApiConfig = this.apiConfig.actAs(providerOrgInterface.organization.id);
        await this.populateVdcs(providerOrgApiConfig, providerOrgInterface.organization.vdcs);

        for (const vdc of providerOrgInterface.organization.vdcs) {
            await this.populateNetworks(providerOrgApiConfig, vdc.networks);
            await this.populateStoragePolicies(providerOrgApiConfig, vdc.storagePolicies);
        }

        log(JSON.stringify(providerOrgInterface, null, 2));
        return providerOrgInterface;
    }

    private async populateVdcs(providerOrgApiConfig, vdcs: BaseStruct[]) {
        const orgVdcs = await ProviderOrg.getVdcs(providerOrgApiConfig, vdcs);
        for (const vdc of vdcs) {
            const temp = orgVdcs.find(entry => entry.id === vdc.id);
            if (temp) {
                vdc.name = temp.name;
                console.log(`OrgVdc: "${vdc.name}" found.`);
            } else {
                console.log(`OrgVdc with ID: "${vdc.id}" not found.`);
            }
        }
    }

    private async populateNetworks(providerOrgApiConfig, networks: BaseStruct[]) {
        const vdcNetworks = await ProviderOrg.getNetworks(providerOrgApiConfig, networks);
        for (const network of networks) {
            const temp = vdcNetworks.find(iter => iter.id === network.id);
            if (temp) {
                network.name = temp.name;
                console.log(`Network: "${network.name}" found.`);
            } else {
                console.log(`Network with ID: "${network.id}" not found.`);
            }
        }
    }

    private async populateStoragePolicies(providerOrgApiConfig, storagePolicies: BaseStruct[]) {
        const queryStoragePolicies = await ProviderOrg.getStoragePolicies(providerOrgApiConfig, storagePolicies);
        for (const storagePolicy of storagePolicies) {
            const temp = queryStoragePolicies.find(iter => storagePolicy.id.endsWith(iter.href.split('/').pop()));
            if (temp) {
                storagePolicy.name = temp.name;
                console.log(`StoragePolicy: "${storagePolicy.name}" found.`);
            } else {
                console.log(`StoragePolicy with ID: "${storagePolicy.id}" not found.`);
            }
        }
    }

}
