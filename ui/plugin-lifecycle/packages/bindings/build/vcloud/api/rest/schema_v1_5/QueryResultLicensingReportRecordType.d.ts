import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultLicensingReportRecordType extends QueryResultRecordType {
    endDate?: Date;
    reportId?: string;
    startDate?: Date;
}
export declare namespace QueryResultLicensingReportRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly END_DATE: "endDate";
        static readonly REPORT_ID: "reportId";
        static readonly START_DATE: "startDate";
    }
}
