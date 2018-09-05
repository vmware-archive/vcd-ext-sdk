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

export interface PluginFileDetails {
    fileName: string;
    size: number;
}

export interface ChangeScopePlugin {
    id?: string;
    pluginName: string;
}
