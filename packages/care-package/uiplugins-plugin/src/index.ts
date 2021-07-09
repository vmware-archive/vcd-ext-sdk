import { Plugin } from '@vcd/care-package-def';
import { NewActions } from './NewActions';
import { BuildActions } from './BuildActions';
import { DeployActions } from './DeployActions';
import { names } from './names';

export const UiPluginCarePackagePlugin: Plugin = {
    ...names,
    newActions: new NewActions(),
    buildActions: new BuildActions(),
    deployActions: new DeployActions(),

    workingDirectory(): string {
        return __dirname;
    }
};
