export interface Schema {
    project?: string;
    name: string;
    description: string;
    urn: string;
    type: ExtensionPointType;
    mainModuleFileName?: string;
    mainModuleSrcPath?: string;
}
export declare type ExtensionPointType = "vm-action" | "vapp-action" | "navigation:datacenter:overview" | "navigation:primary" | "navigation:applications" | "navigation:datacenter:compute" | "navigation:datacenter:network" | "navigation:datacenter:storage";
