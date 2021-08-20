import * as def from '@vcd/care-package-def';
import {JSONSchema7} from 'json-schema';
import {ImportVApp} from './ImportVApp';

export class DeployActions implements def.DeployActions {

    getInputSchema(action: string): JSONSchema7 {
        return null;
    }

    async deploy(params: def.DeployActionParameters) {
        const importVApp = new ImportVApp(params.clientConfig);
        await importVApp.executeRequests(params.elements[0]);
    }
}
