import {
    createExtensionPointFiles,
    importExtensionPointComponentToModule,
    updateUiPluginManifest,
    addExports,
} from "../schematic-steps";
import { ExtensionPointDefinition } from "../interfaces";

export const NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG: ExtensionPointDefinition = {
    template: {
        name: "view-extension-point",
    },
    schematicSteps: [
        createExtensionPointFiles,
        importExtensionPointComponentToModule,
        updateUiPluginManifest,
        addExports,
    ],
};