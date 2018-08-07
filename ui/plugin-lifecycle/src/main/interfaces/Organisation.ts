export interface Organisation {
    canPublishCatalogs: boolean;
    deployedVMQuota: number;
    displayName: string;
    href: string;
    isEnabled: boolean;
    isReadOnly: boolean;
    name: string;
    numberOfCatalogs: number;
    numberOfDisks: number;
    numberOfGroups: number;
    numberOfRunningVMs: number;
    numberOfVApps: number;
    numberOfVdcs: number;
    storedVMQuota: number;
}
