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

const log = debug('vcd:ext:import-vapp');

export class ImportVApp {

    transferClient: TransferClient;
    legacyApiClient: LegacyApiClient;

    constructor(apiConfig: CloudDirectorConfig) {
        const providerOrgApiConfig = apiConfig.actAs('87ae2b63-da4e-4602-af80-0f722e1a1394');
        this.transferClient = providerOrgApiConfig.makeTransferClient();
        this.legacyApiClient = providerOrgApiConfig.makeLegacyApiClient();
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
        const instantiateOvfUrl = '/api/vdc/a61bced4-168f-4944-9b1d-9b667c34dd62/action/instantiateOvf';

        const networkConfig: NetworkConfigSectionType = {
            // @ts-ignore
            _type: 'NetworkConfigSectionType',
            networkConfig: [
                {
                    networkName: 'vdcnet',
                    configuration: {
                        parentNetwork: {
                            href: 'https://bos1-vcloud-static-172-177.eng.vmware.com/api/admin/network/b0064f6f-dbd1-47de-8726-fd60653bae86'
                        },
                        fenceMode: 'bridged'
                    }
                }
            ]
        };

        const networkConnection: NetworkConnectionSectionType = {
            // @ts-ignore
            _type: 'NetworkConnectionSectionType',
            primaryNetworkConnectionIndex: 0,
            networkConnection: [{
                network: 'vdcnet',
                needsCustomization: true,
                networkConnectionIndex: 0,
                ipAddress: 'any',
                isConnected: true,
                ipAddressAllocationMode: 'DHCP',
                networkAdapterType: 'VMXNET3'
            }]
        };

        const params: InstantiateOvfParamsType = {
            name: configuration.vAppName,
            powerOn: false,
            allEULAsAccepted: true,
            instantiationParams: {
                section: [networkConfig]
            },
            instantiateOvfProperty: configuration.instantiateOvfProperties,
            instantiateVmParams: [{
                id: 'ubuntu-focal-20.04-cloudimg-20210623',
                networkConnectionSection: networkConnection,
                computerName: 'ubuntu-focal-20.04-cloudimg-20210622',
                vdcStorageProfile: {
                    href: 'https://bos1-vcloud-static-172-177.eng.vmware.com/api/vdcStorageProfile/03e0cb57-e9fe-400b-aa61-e4114342491b',
                    name: '*',
                    type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml'
                },
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
}
