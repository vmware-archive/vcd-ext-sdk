import { Plugin } from '@vcd/care-package-def';
import { BuildActions } from './BuildActions';
import { DeployActions } from './DeployActions';
import { names } from './names';

export const UiPluginCarePackagePlugin: Plugin = {
    ...names,
    buildActions: new BuildActions(),
    deployActions: new DeployActions()
};
