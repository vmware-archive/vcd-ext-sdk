import { ResourceType } from "./../ResourceType";
import { LicensingReportSampleType } from "./LicensingReportSampleType";
export declare class LicensingReportType extends ResourceType {
    sample?: LicensingReportSampleType[];
    productSerialNumber?: string;
    reportDate?: Date;
    signature?: string;
}
export declare namespace LicensingReportType {
    class Fields extends ResourceType.Fields {
        static readonly SAMPLE: "sample";
        static readonly PRODUCT_SERIAL_NUMBER: "productSerialNumber";
        static readonly REPORT_DATE: "reportDate";
        static readonly SIGNATURE: "signature";
    }
}
