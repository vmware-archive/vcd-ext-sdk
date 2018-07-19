import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class TenantErrorType extends VCloudExtensibleType {
    majorErrorCode?: number;
    message?: string;
    minorErrorCode?: string;
    vendorSpecificErrorCode?: string;
}
export declare namespace TenantErrorType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MAJOR_ERROR_CODE: "majorErrorCode";
        static readonly MESSAGE: "message";
        static readonly MINOR_ERROR_CODE: "minorErrorCode";
        static readonly VENDOR_SPECIFIC_ERROR_CODE: "vendorSpecificErrorCode";
    }
}
