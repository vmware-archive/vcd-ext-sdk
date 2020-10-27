export interface Schema {
    project?: string;
    name: string;
    description: string;
    urn: string;
    manifest: string;
    type: ExtensionPointType;
    uiPluginMainModulePath?: string;
    path?: string;
}

export type ExtensionPointType = "vm-action" | "vapp-action" | "navigation:datacenter:overview" |
    "navigation:primary" | "navigation:applications" | "navigation:datacenter:compute" | "navigation:datacenter:network" |
    "navigation:datacenter:storage";