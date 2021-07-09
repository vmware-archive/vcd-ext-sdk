import { Plugin } from '@vcd/care-package-def';
import { BuildActions } from './BuildActions';
import { DeployActions } from './DeployActions';
import { names } from './names';
import {BaseNewActions} from '@vcd/care-package-plugin-abstract';

export const TypesCarePackagePlugin: Plugin = {
    ...names,
    newActions: new BaseNewActions(),
    buildActions: new BuildActions(),
    deployActions: new DeployActions(),

    workingDirectory(): string {
        return __dirname;
    }
};
