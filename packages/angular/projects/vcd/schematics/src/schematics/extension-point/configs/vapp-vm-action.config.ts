import {
    createExtensionPointFiles,
    importExtensionPointComponentToModule,
    updateUiPluginManifest,
    addExports,
} from '../schematic-steps';
import { ExtensionPointDefinition } from '../interfaces';

export const VAPP_VM_ACTION_CONFIG: ExtensionPointDefinition = {
    template: {
        name: 'entity-action-extension-point',
    },
    schematicSteps: [
        createExtensionPointFiles,
        importExtensionPointComponentToModule,
        updateUiPluginManifest,
        addExports,
    ],
};
