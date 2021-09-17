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
                    }
                }
            };
        }
        return null;
    }

    getConfiguration?(): any {
        return {
            vAppName: '',
            instantiateOvfProperties: []
        };
    }

    generate(generator: Generator, answers: any) {
        let folderName = answers.elements[names.name].name || names.name;
        folderName = path.join(path.join('packages', folderName));
        fs.mkdirSync(folderName, { recursive: true });
    }

    pack({elements, options}: BuildActionParameters) {
        for (const element of elements) {
            this.packImpl.pack(element, options.zip);
        }
        return Promise.resolve(elements);
    }

    async deploy({clientConfig, elements}: careDef.BuildActionParameters) {
        const providerOrg = new ProviderOrg(clientConfig);
        const providerOrgEntities = await providerOrg.getProviderOrgEntities();
        const importVApp = new ImportVApp(providerOrgEntities, clientConfig);
        for (const element of elements) {
            await importVApp.executeRequests(element);
        }
    }
}
