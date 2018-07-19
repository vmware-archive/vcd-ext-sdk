import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVmDiskRelationRecordType extends QueryResultRecordType {
    disk?: string;
    vdc?: string;
    vm?: string;
}
export declare namespace QueryResultVmDiskRelationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DISK: "disk";
        static readonly VDC: "vdc";
        static readonly VM: "vm";
    }
}
