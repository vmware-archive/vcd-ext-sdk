import * as def from '@vcd/care-package-def';
import {JSONSchema7} from 'json-schema';
import {ImportVApp} from './ImportVApp';
import {ProviderOrg} from '@vcd/care-package-plugin-abstract/lib/ProviderOrg';

export class DeployActions implements def.DeployActions {

    getInputSchema(action: string): JSONSchema7 {
        return null;
    }

    async deploy({clientConfig, elements}: def.DeployActionParameters) {
        const providerOrg = new ProviderOrg(clientConfig);
        const providerOrgInterface = await providerOrg.getProviderOrgInterface();
        const importVApp = new ImportVApp(providerOrgInterface, clientConfig);
        for (const element of elements) {
            await importVApp.executeRequests(element);
        }
    }
}
