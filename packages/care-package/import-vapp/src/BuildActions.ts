import * as careDef from '@vcd/care-package-def';
import { JSONSchema7 } from 'json-schema';
import * as fs from 'fs';
import * as Generator from 'yeoman-generator';
import { names } from './names';
import {ImportVApp} from './ImportVApp';
import {BuildActionParameters} from '@vcd/care-package-def';
import path from 'path';
import {PackImpl} from '@vcd/care-package-plugin-abstract/lib/PackImpl';
import {ProviderOrg} from '@vcd/care-package-plugin-abstract/lib/ProviderOrg';
import tar from 'tar-fs';

export class BuildActions implements careDef.BuildActions {

    packImpl = new PackImpl();

    getInputSchema(action: string): JSONSchema7 {
        if (action === 'generate') {
            return {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'element name'
                    },
                    vAppName: {
                        type: 'string',
                        description: 'vApp name'
                    },
                    ova: {
                        type: 'string',
                        description: 'OVA full local path'
                    }
                }
            };
        }
        return null;
    }

    getConfiguration?(elementAnswers: any): any {
        return {
            vAppName: elementAnswers.vAppName,
            instantiateOvfProperties: []
        };
    }

    async generate(generator: Generator, answers: any) {
        let folderName = answers.elements[names.name].name || names.name;
        folderName = path.join(path.join('packages', folderName));
        fs.mkdirSync(folderName, { recursive: true });

        const ovaFullPath = answers.elements[names.name].ova;
        await this.extractOva(folderName, ovaFullPath);
    }

    async extractOva(pluginFolder: string, ovaFullPath: string): Promise<string> {
        if (!ovaFullPath || !ovaFullPath.toLowerCase().endsWith('ova')) {
            throw new Error(`Selected file is not an OVA: ${ovaFullPath}`);
        }
        console.log(`Extracting ${ovaFullPath} into ${pluginFolder}`);

        return new Promise((resolve) => {
            fs.createReadStream(ovaFullPath)
                .pipe(tar.extract(pluginFolder))
                .on('finish', () => resolve(pluginFolder));
        });
    }

    pack({elements, options}: BuildActionParameters) {
        for (const element of elements) {
            this.packImpl.pack(element, options.zip);
        }
        return Promise.resolve(elements);
    }

    async deploy({clientConfig, elements}: careDef.BuildActionParameters) {
        const providerOrg = new ProviderOrg(clientConfig);
        const providerOrgInterface = await providerOrg.getProviderOrgInterface();
        const importVApp = new ImportVApp(providerOrgInterface, clientConfig);
        for (const element of elements) {
            await importVApp.executeRequests(element);
        }
    }
}
