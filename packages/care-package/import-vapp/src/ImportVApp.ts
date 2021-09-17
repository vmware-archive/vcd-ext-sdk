import {CloudDirectorConfig} from '@vcd/node-client';
import * as careDef from '@vcd/care-package-def';
import {Configuration} from './Configuration';
import fs from 'fs';
import {InstantiateOvfParamsType, NetworkConfigSectionType, VAppType} from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import {NetworkConnectionSectionType} from '@vcd/bindings/vcloud/api/rest/schema_v1_5/NetworkConnectionSectionType';
import {TransferClient} from '@vcd/node-client/lib/transfer';
import {LegacyApiClient} from '@vcd/node-client/lib/legacy.api.client';
import path from 'path';
import debug from 'debug';
import {ProviderOrgEntities} from '@vcd/care-package-plugin-abstract/lib/ProviderOrg';

const log = debug('vcd:ext:import-vapp');

export class ImportVApp {

    basePath: string;
    transferClient: TransferClient;
    legacyApiClient: LegacyApiClient;
    providerOrgEntities: ProviderOrgEntities;

    constructor(providerOrgEntities: ProviderOrgEntities, apiConfig: CloudDirectorConfig) {
        this.providerOrgEntities = providerOrgEntities;
        this.basePath = apiConfig.basePath;

        const providerOrgApiConfig = apiConfig.actAs(providerOrgEntities.org.id);
        this.legacyApiClient = providerOrgApiConfig.makeLegacyApiClient();
        this.transferClient = providerOrgApiConfig.makeTransferClient();
    }

    public async executeRequests({name, configuration}: careDef.ElementBase) {
        log('configuration: ' +  JSON.stringify(configuration, null, 2));

        const pluginDirPath = path.join('packages', name);
        log('pluginDirPath: ' +  pluginDirPath);

        const ovf = fs.readdirSync(pluginDirPath)
            .filter(filename => filename.endsWith('.ovf'))
            .map(filename => path.join(pluginDirPath, filename))
            .pop();
        console.log('OVF to upload: ' + ovf);

        let vApp = await this.instantiateOvf(configuration);

        let selfHref = vApp.href;
        selfHref = selfHref.substring(selfHref.indexOf('/api/vApp/'));
        log('selfHref: ' +  selfHref);

        const transferHref = vApp.files.file[0].link[0].href;
        log('transferHref: ' + transferHref);
        await this.transfer(transferHref, ovf);

        let filesCount = 1;
        while (filesCount === 1) {
            vApp = await this.legacyApiClient.get<VAppType>(selfHref);
            log('vApp.files: ' +  JSON.stringify(vApp.files, null, 2));
            filesCount = vApp.files.file.length;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        for (const file of vApp.files.file) {
            if (file.name.endsWith('.ovf')) {
                continue;
            }
            for (const link of file.link) {
                if (link.rel !== 'upload:default') {
                    continue;
                }
                console.log(`Uploading: ${file.name}`);
                await this.transfer(link.href, path.join(pluginDirPath, file.name));
                console.log(`Uploaded:  ${file.name}`);
            }
        }

        console.log(`VApp: '${configuration.vAppName}' imported successfully.`);
    }

    private async transfer(transferUrl: string, filePath: string) {
        const contentType = 'application/*+xml;charset=utf-8';
        await this.transferClient.upload(transferUrl, filePath, contentType);
    }

    private async instantiateOvf(configuration: Configuration): Promise<VAppType> {
        const lastIndexOfSemiColumn = this.providerOrgEntities.vdc.id.lastIndexOf(`:`);
        const vdcPlainId = this.providerOrgEntities.vdc.id.substring(lastIndexOfSemiColumn + 1);
        const instantiateOvfUrl = `/api/vdc/${vdcPlainId}/action/instantiateOvf`;
        const params: InstantiateOvfParamsType = {
            name: configuration.vAppName,
            powerOn: false,
            allEULAsAccepted: true,
            instantiationParams: {
                section: [this.getNetworkConfigSection()]
            },
            instantiateOvfProperty: configuration.instantiateOvfProperties,
            instantiateVmParams: [{
                id: configuration.vAppName.replace(' ', '-'),
                networkConnectionSection: this.getNetworkConnectionSectionType(),
                computerName: configuration.vAppName,
                vdcStorageProfile: this.getVdcStorageProfile(),
                hardwareCustomization: {
                    numberOfCpus: 2,
                    coresPerSocket: 1,
                    memorySize: 1024
                }
            }]
        };

        log('params: ' +  JSON.stringify(params, null, 2));

        const vApp: VAppType = await this.legacyApiClient.post<InstantiateOvfParamsType>(instantiateOvfUrl, params);
        log('vApp: ' +  JSON.stringify(vApp, null, 2));
        return vApp;
    }

    private getNetworkConfigSection(): NetworkConfigSectionType {
        const lastIndexOfSemiColumn = this.providerOrgEntities.network.id.lastIndexOf(`:`);
        const networkPlainId = this.providerOrgEntities.network.id.substring(lastIndexOfSemiColumn + 1);
        return {
            // @ts-ignore
            _type: 'NetworkConfigSectionType',
            networkConfig: [
                {
                    networkName: this.providerOrgEntities.network.name,
                    configuration: {
                        parentNetwork: {
                            href: `${this.basePath}/api/admin/network/${networkPlainId}`
                        },
                        fenceMode: 'bridged'
                    }
                }
            ]
        };
    }

    private getNetworkConnectionSectionType(): NetworkConnectionSectionType {
        return {
            // @ts-ignore
            _type: 'NetworkConnectionSectionType',
            primaryNetworkConnectionIndex: 0,
            networkConnection: [{
                network: this.providerOrgEntities.network.name,
                needsCustomization: true,
                networkConnectionIndex: 0,
                ipAddress: 'any',
                isConnected: true,
                ipAddressAllocationMode: 'DHCP',
                networkAdapterType: 'VMXNET3'
            }]
        };
    }

    private getVdcStorageProfile() {
        const lastIndexOfSemiColumn = this.providerOrgEntities.storageProfile.id.lastIndexOf(`:`);
        const storageProfilePlainId = this.providerOrgEntities.storageProfile.id.substring(lastIndexOfSemiColumn + 1);
        return  {
            href: `${this.basePath}/api/vdcStorageProfile/${storageProfilePlainId}`,
            name: this.providerOrgEntities.storageProfile.name,
            type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml'
        };
    }
}
