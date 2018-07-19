import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultCellRecordType extends QueryResultRecordType {
    buildDate?: Date;
    isActive?: number;
    isVMwareVc?: number;
    name?: string;
    primaryIp?: string;
    version?: string;
}
export declare namespace QueryResultCellRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly BUILD_DATE: "buildDate";
        static readonly IS_ACTIVE: "isActive";
        static readonly IS_VMWARE_VC: "isVMwareVc";
        static readonly NAME: "name";
        static readonly PRIMARY_IP: "primaryIp";
        static readonly VERSION: "version";
    }
}
