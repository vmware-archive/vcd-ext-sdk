import { AbstractDeployActions, ComponentDeployer } from '@vcd/care-package-plugin-abstract';
import { JSONSchema7 } from 'json-schema';
import { names } from './names';
import { UIPluginComponentDeployer } from './UIPluginComponentDeployer';

export class DeployActions extends AbstractDeployActions {
    name = names.name;

    getInputSchema(_: string): JSONSchema7 {
        return null;
    }

    getComponentDeployer(options: any): ComponentDeployer {
        return new UIPluginComponentDeployer(options.config);
    }
}
