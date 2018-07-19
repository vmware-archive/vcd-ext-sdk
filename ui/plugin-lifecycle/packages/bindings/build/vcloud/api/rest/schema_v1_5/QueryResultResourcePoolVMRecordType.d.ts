import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultResourcePoolVMRecordType extends QueryResultRecordType {
    containerName?: string;
    guestOs?: string;
    hardwareVersion?: number;
    isBusy?: boolean;
    isDeployed?: boolean;
    name?: string;
    status?: string;
}
export declare namespace QueryResultResourcePoolVMRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CONTAINER_NAME: "containerName";
        static readonly GUEST_OS: "guestOs";
        static readonly HARDWARE_VERSION: "hardwareVersion";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly NAME: "name";
        static readonly STATUS: "status";
    }
}
