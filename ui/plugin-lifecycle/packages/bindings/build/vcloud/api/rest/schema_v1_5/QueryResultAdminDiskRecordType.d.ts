import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminDiskRecordType extends QueryResultRecordType {
    busSubType?: string;
    busType?: string;
    busTypeDesc?: string;
    datastore?: string;
    datastoreName?: string;
    isAttached?: boolean;
    name?: string;
    org?: string;
    ownerName?: string;
    sizeB?: number;
    status?: string;
    storageProfile?: string;
    storageProfileName?: string;
    task?: string;
    vc?: string;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultAdminDiskRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly BUS_SUB_TYPE: "busSubType";
        static readonly BUS_TYPE: "busType";
        static readonly BUS_TYPE_DESC: "busTypeDesc";
        static readonly DATASTORE: "datastore";
        static readonly DATASTORE_NAME: "datastoreName";
        static readonly IS_ATTACHED: "isAttached";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly OWNER_NAME: "ownerName";
        static readonly SIZE_B: "sizeB";
        static readonly STATUS: "status";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly STORAGE_PROFILE_NAME: "storageProfileName";
        static readonly TASK: "task";
        static readonly VC: "vc";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}
