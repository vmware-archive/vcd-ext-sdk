import { AbstractDeployActions, ComponentDeployerConstructor } from '@vcd/care-package-plugin-abstract';
import { TypesComponentDeployer } from './deploy';
import { names } from './names';

export class DeployActions extends AbstractDeployActions {
    name = names.name;

    getComponentDeployer(): ComponentDeployerConstructor {
        return TypesComponentDeployer;
    }
}
