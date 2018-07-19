export interface Plugin {
    pluginName: string;
    vendor: string;
    description: string;
    version: string;
    license: string;
    link: string;
    tenant_scoped: boolean;
    provider_scoped: boolean;
    enabled: boolean;
    id: string;
    plugin_status: string;
    resourcePath: string;
}

export interface UploadPayload {
    manifest: PluginManifest;
    fileName: string;
    fileDir: string;
    file: File;
}

export interface PluginManifest {
    urn: string;
    name: string;
    containerVersion: string;
    version: string;
    scope: string[];
    permissions: string[];
    description: string;
    vendor: string;
    license: string;
    link: string;
    module: string;
    route: string;
}

export interface PluginDesc {
    pluginName: string;
    vendor: string;
    description: string;
    version: string;
    license: string;
    link: string;
    tenant_scoped: boolean;
    provider_scoped: boolean;
    enabled: boolean;
}

export interface PluginFileDetails {
    fileName: string;
    size: number;
}