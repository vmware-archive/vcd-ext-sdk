import {CloudDirectorConfig, OrgVdcNetworkApi, VdcApi} from '@vcd/node-client';
import {
    MetadataStringValue,
    MetadataType,
    QueryResultRecordsType,
    VdcStorageProfileType
} from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import {QueryResultOrgRecordType} from '@vcd/bindings/vcloud/api/rest/schema_v1_5/QueryResultOrgRecordType';
import {LegacyApiClient} from '@vcd/node-client/lib/legacy.api.client';

export class ProviderOrgEntities {

    org: {
        name: string;
        id: string;
    };
    vdc: {
        name: string;
        id: string;
    };
    network: {
        name: string;
        id: string;
    };
    storageProfile: {
        name: string;
        id: string;
    };
    limits: string;
}

export class ProviderOrg {

    apiConfig: CloudDirectorConfig;

    constructor(apiConfig: CloudDirectorConfig) {
        this.apiConfig = apiConfig;
    }

    private static async getOrg(legacyApiClient: LegacyApiClient) {
        const query = `/api/query?type=organization&filter=metadata@SYSTEM:ProviderOrg==BOOLEAN:true`;
        const organisations = await legacyApiClient.get<QueryResultRecordsType>(query);
        if (organisations.total === 0) {
            throw new Error(`No organisation is tagged with 'ProviderOrg==BOOLEAN:true'`);
        } else if (organisations.total > 1) {
            throw new Error(`More than one organisation is tagged with 'ProviderOrg==BOOLEAN:true'`);
        }

        const lastIndexOfSlash = organisations.record[0].href.lastIndexOf('/');
        return {
            id: `urn:vcloud:org:${organisations.record[0].href.substring(lastIndexOfSlash + 1)}`,
            name: (organisations.record[0] as QueryResultOrgRecordType).name
        };
    }

    private static async getMetadata(legacyApiClient: LegacyApiClient, orgId: string): Promise<MetadataType> {
        const lastIndexOfSemiColumn = orgId.lastIndexOf(`:`);
        const orgMetadataUrl = `/api/org/${orgId.substring(lastIndexOfSemiColumn + 1)}/metadata`;
        const orgMetadata = await legacyApiClient.get<MetadataType>(orgMetadataUrl);

        if (orgMetadata.metadataEntry
            .filter(entry => entry.key === `ProviderOrgVdc`)
            .length !== 1) {
            throw new Error(`Missing Org Metadata with tag 'ProviderOrgVdc'`);
        }

        if (orgMetadata.metadataEntry
            .filter(entry => entry.key === `ProviderOrgNetwork`)
            .length !== 1) {
            throw new Error(`Missing Org Metadata with tag 'ProviderOrgNetwork'`);
        }

        if (orgMetadata.metadataEntry
            .filter(entry => entry.key === `ProviderOrgVdcStorageProfile`)
            .length !== 1) {
            throw new Error(`Missing Org Metadata with tag 'ProviderOrgVdcStorageProfile'`);
        }

        return orgMetadata;
    }

    private static async getVdc(providerOrgApiConfig: CloudDirectorConfig, typedValue: MetadataStringValue) {
        const vdcApi = providerOrgApiConfig.makeApiClient(VdcApi);
        const metadataStringValue = typedValue;
        const orgVdc = await vdcApi.getVdc(metadataStringValue.value);
        if (!orgVdc) {
            throw new Error(`Unable to retrieve VDC with id ${metadataStringValue.value}`);

        }
        return {
            id: orgVdc.body.id,
            name: orgVdc.body.name
        };
    }

    private static async getNetwork(providerOrgApiConfig: CloudDirectorConfig, typedValue: MetadataStringValue) {
        const orgVdcNetworksApi = providerOrgApiConfig.makeApiClient(OrgVdcNetworkApi);
        const metadataStringValue = typedValue;
        const orgVdcNetwork = await orgVdcNetworksApi.getOrgVdcNetwork(metadataStringValue.value);
        if (!orgVdcNetwork) {
            throw new Error(`Unable to retrieve network with id ${metadataStringValue.value}`);

        }
        return {
            id: orgVdcNetwork.body.id,
            name: orgVdcNetwork.body.name
        };
    }

    private static async getStorageProfile(providerOrgApiConfig: CloudDirectorConfig, typedValue: MetadataStringValue) {
        const legacyApiClient = providerOrgApiConfig.makeLegacyApiClient();
        const metadataStringValue = typedValue;
        const lastIndexOfSemiColumn = metadataStringValue.value.lastIndexOf(`:`);
        const vdcStorageProfilePlainId = metadataStringValue.value.substring(lastIndexOfSemiColumn + 1);
        const orgVdcStoragePolicies = `/api/vdcStorageProfile/${vdcStorageProfilePlainId}`;
        const vdcStorageProfiles = await legacyApiClient.get<VdcStorageProfileType>(orgVdcStoragePolicies);
        if (!vdcStorageProfiles) {
            throw new Error(`Unable to retrieve storage profile with id ${metadataStringValue.value}`);
        }
        return {
            id: vdcStorageProfiles.id,
            name: vdcStorageProfiles.name
        };
    }

    public async getProviderOrgEntities(): Promise<ProviderOrgEntities> {
        const legacyApiClient = this.apiConfig.makeLegacyApiClient();
        const poe = new ProviderOrgEntities();
        poe.org = await ProviderOrg.getOrg(legacyApiClient);

        const metadata = await ProviderOrg.getMetadata(legacyApiClient, poe.org.id);

        const vdcMetadata = metadata.metadataEntry
            .find(entry => entry.key === `ProviderOrgVdc`)
            .typedValue;
        const networkMetadata = metadata.metadataEntry
            .find(entry => entry.key === `ProviderOrgNetwork`)
            .typedValue;
        const storageProfileMetadata = metadata.metadataEntry
            .find(entry => entry.key === `ProviderOrgVdcStorageProfile`)
            .typedValue;

        const providerOrgApiConfig = this.apiConfig.actAs(poe.org.id);
        poe.vdc = await ProviderOrg.getVdc(providerOrgApiConfig, vdcMetadata);
        poe.network = await ProviderOrg.getNetwork(providerOrgApiConfig, networkMetadata);
        poe.storageProfile = await ProviderOrg.getStorageProfile(providerOrgApiConfig, storageProfileMetadata);

        return poe;
    }
}
