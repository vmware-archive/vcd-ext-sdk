import { ContainerType } from "./ContainerType";
import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultRecordsType extends ContainerType {
    record?: QueryResultRecordType[];
}
export declare namespace QueryResultRecordsType {
    class Fields extends ContainerType.Fields {
        static readonly RECORD: "record";
    }
}
