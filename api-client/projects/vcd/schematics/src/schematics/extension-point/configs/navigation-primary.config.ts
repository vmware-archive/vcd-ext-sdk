import {
    createExtensionPointFiles,
    updateUiPluginManifestForPrimary,
    addExportsForPrimary,
    updateAngularJson,
    updatePluginRegistrations,
} from "../schematic-steps";
import { ExtensionPointDefinition } from "../interfaces";

export const NAVIGATION_PRIMARY_CONFIG: ExtensionPointDefinition = {
    template: {
        name: "module-extension-point",
    },
    schematicSteps: [
        createExtensionPointFiles,
        updateUiPluginManifestForPrimary,
        addExportsForPrimary,
        updateAngularJson,
        updatePluginRegistrations,
    ],
};