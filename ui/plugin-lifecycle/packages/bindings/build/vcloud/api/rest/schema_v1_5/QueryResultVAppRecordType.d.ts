import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVAppRecordType extends QueryResultRecordType {
    creationDate?: Date;
    isAutoNature?: boolean;
    isBusy?: boolean;
    isDeployed?: boolean;
    isEnabled?: boolean;
    isExpired?: boolean;
    isInMaintenanceMode?: boolean;
    isPublic?: boolean;
    name?: string;
    ownerName?: string;
    status?: string;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultVAppRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CREATION_DATE: "creationDate";
        static readonly IS_AUTO_NATURE: "isAutoNature";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_EXPIRED: "isExpired";
        static readonly IS_IN_MAINTENANCE_MODE: "isInMaintenanceMode";
        static readonly IS_PUBLIC: "isPublic";
        static readonly NAME: "name";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}
