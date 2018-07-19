import { ResourceType } from "./../ResourceType";
export declare class CatalogSettingsType extends ResourceType {
    isSyncEnabled?: boolean;
    syncStartDate?: Date;
    syncStopDate?: Date;
    refreshInterval?: number;
}
export declare namespace CatalogSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly IS_SYNC_ENABLED: "isSyncEnabled";
        static readonly SYNC_START_DATE: "syncStartDate";
        static readonly SYNC_STOP_DATE: "syncStopDate";
        static readonly REFRESH_INTERVAL: "refreshInterval";
    }
}
