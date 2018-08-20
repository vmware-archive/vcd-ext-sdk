export interface Tenant {
    canPublishCatalogs: boolean;
    deployedVMQuota: number;
    displayName: string;
    href: string;
    id: string;
    isEnabled: boolean;
    isReadOnly: boolean;
    link: string[];
    metadata: string;
    name: string;
    numberOfCatalogs: number;
    numberOfDisks: number;
    numberOfGroups: number;
    numberOfVApps: number;
    numberOfVdcs: number;
    otherAttributes: {
        numberOfRunningVMs: string;
    };
    storedVMQuota: number;
    type: string;
}

export interface UiTenantResponse {
    href: string;
    link: string[];
    name: string;
    otherAttributes: any;
    page: number;
    pageSize: 25;
    record: Tenant[];
    total: number;
    type: string;
    vcloudExtension: any[];
}

export interface UiPluginTenantsResponse {
    name: string;
    id: string;
}
