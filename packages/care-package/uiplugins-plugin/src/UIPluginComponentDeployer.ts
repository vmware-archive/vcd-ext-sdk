import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import debug from 'debug';
import AdmZip from 'adm-zip';

import {
    CloudDirectorConfig,
    UiPluginApi,
    UiPluginMetadataResponse,
    UiPluginResourceApi,
    UiPluginsApi,
    UploadSpec
} from '@vcd/node-client';
import { ComponentDeployer, glob } from '@vcd/care-package-plugin-abstract';

const log = debug('vcd:ext:deployer:uiPlugin');

const getIdComponent = (pluginMetadata: any) => {
    return `${pluginMetadata.vendor}-${pluginMetadata.pluginName}-${pluginMetadata.version}`;
};

const toPluginMetadata = (manifest: any) => {
    return {
        pluginName: manifest.name,
        description: manifest.description,
        license: manifest.license,
        link: manifest.link,
        enabled: true,
        version: manifest.version,
        vendor: manifest.vendor,
        provider_scoped: manifest.scope.join(';').indexOf('provider') >= 0,
        tenant_scoped: manifest.scope.join(';').indexOf('tenant') >= 0
    };
};

export class UIPluginComponentDeployer implements ComponentDeployer {
    uiPluginApi: UiPluginApi;
    uiPluginsApi: UiPluginsApi;
    uiPluginResourceApi: UiPluginResourceApi;

    constructor(private apiConfig: CloudDirectorConfig) {
        this.uiPluginApi = this.apiConfig.makeApiClient(UiPluginApi);
        this.uiPluginsApi = this.apiConfig.makeApiClient(UiPluginsApi);
        this.uiPluginResourceApi = this.apiConfig.makeApiClient(UiPluginResourceApi);
    }

    private async traverse(
        location: string,
        pattern: string,
        visitor: (file: string, pluginMetadata: any, existingPlugin?: any
    ) => Promise<any>) {
        const files = glob(location, pattern);
        if (!files || files.length === 0) {
            log('No plugin files to upload!');
            return Promise.resolve();
        }
        log(`Plugin files to upload: ${files}`);
        const response = await this.uiPluginsApi.getUiPlugins();
        const existingPlugins = response.body
            .reduce((prev: any, curr: UiPluginMetadataResponse) => {
                prev[getIdComponent(curr)] = curr;
                return prev;
            }, {});
        log(existingPlugins);
        return Promise.all(
            files.map(async file => {
                log(`Loading plugin from file: ${file}`);
                const data: Buffer = fs.readFileSync(file);
                const zip = new AdmZip(data);
                const pluginMetadata = toPluginMetadata(JSON.parse(zip.readAsText('manifest.json')));
                const existingPlugin = existingPlugins[getIdComponent(pluginMetadata)];
                return visitor(file, pluginMetadata, existingPlugin);
            })
        );
    }

    async deploy(location: string, pattern: string): Promise<any> {
        log(`Deploy operation called for ${location}/${pattern}`);
        return this.traverse(location, pattern, async (file: string, pluginMetadata: any, existingPlugin?: any) => {
            if (existingPlugin) {
                throw new Error(`Plugin already exists. Updated is not supported. Use --force option to clean up and deploy.`);
            }
            log(`Creating new plugin ${pluginMetadata.pluginName}`);
            const pluginMetadataResponse = (await this.uiPluginsApi.addUiPlugin(pluginMetadata)).body;
            log(pluginMetadataResponse);
            const data: Buffer = fs.readFileSync(file);
            const checksum = crypto.createHash('sha256').update(data).digest('hex');
            const response = await this.uiPluginResourceApi.uploadUiPluginResource({
                fileName: path.basename(file),
                size: data.length,
                checksum,
                checksumAlgo: UploadSpec.ChecksumAlgoEnum.Sha256
            }, pluginMetadataResponse.id);
            log(JSON.stringify(response.response, null, 2));
            let uploadLink =  response.response.headers.link as string;
            const match = uploadLink.match(/<(.+)>/i);
            if (!match) {
                throw new Error(`No or invalid upload link ${uploadLink}`);
            }
            uploadLink = match[1];
            log(`Upload plugin to: ${uploadLink}`);
            const transferClient = this.apiConfig.makeTransferClient();
            return transferClient.upload(uploadLink, file, 'application/zip');

        });
    }

    async clean(location: string, pattern: string) {
        log(`Clean operation called for ${location}/${pattern}`);
        return this.traverse(location, pattern, async (_: string, __: any, existingPlugin?: any) => {
            if (existingPlugin) {
                log(`Removing plugin ${existingPlugin.pluginName}`);
                await this.uiPluginResourceApi.deleteUiPluginResource(existingPlugin.id)
                    .catch(e => log('Error removing plugin resource', e));
                return this.uiPluginApi.deleteUiPlugin(existingPlugin.id);
            }
            return Promise.resolve();
        });
    }

}
