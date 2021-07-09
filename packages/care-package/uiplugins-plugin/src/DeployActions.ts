import { AbstractDeployActions, ComponentDeployerConstructor } from '@vcd/care-package-plugin-abstract';
import { names } from './names';
import { UIPluginComponentDeployer } from './UIPluginComponentDeployer';

export class DeployActions extends AbstractDeployActions {
    name = names.name;

    getComponentDeployer(): ComponentDeployerConstructor {
        return UIPluginComponentDeployer;
    }
}
