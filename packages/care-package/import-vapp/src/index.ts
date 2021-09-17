import {Plugin} from '@vcd/care-package-def';
import {names} from './names';
import {BuildActions} from './BuildActions';
import {DeployActions} from './DeployActions';

export const ImportVAppCarePackagePlugin: Plugin = {
    ...names,
    buildActions: new BuildActions(),
    deployActions: new DeployActions()

};
