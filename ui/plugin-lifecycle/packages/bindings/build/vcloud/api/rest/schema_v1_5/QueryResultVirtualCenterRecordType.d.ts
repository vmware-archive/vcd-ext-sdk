import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVirtualCenterRecordType extends QueryResultRecordType {
    isBusy?: boolean;
    isEnabled?: boolean;
    isSupported?: boolean;
    listenerState?: string;
    name?: string;
    status?: string;
    url?: string;
    userName?: string;
    uuid?: string;
    vcVersion?: string;
    vsmIP?: string;
}
export declare namespace QueryResultVirtualCenterRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_BUSY: "isBusy";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_SUPPORTED: "isSupported";
        static readonly LISTENER_STATE: "listenerState";
        static readonly NAME: "name";
        static readonly STATUS: "status";
        static readonly URL: "url";
        static readonly USER_NAME: "userName";
        static readonly UUID: "uuid";
        static readonly VC_VERSION: "vcVersion";
        static readonly VSM_IP: "vsmIP";
    }
}
