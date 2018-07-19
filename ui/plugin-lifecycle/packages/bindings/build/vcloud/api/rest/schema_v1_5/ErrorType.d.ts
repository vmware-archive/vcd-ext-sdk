import { TenantErrorType } from "./TenantErrorType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ErrorType extends VCloudExtensibleType {
    tenantError?: TenantErrorType;
    stackTrace?: string;
    majorErrorCode?: number;
    message?: string;
    minorErrorCode?: string;
    vendorSpecificErrorCode?: string;
}
export declare namespace ErrorType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TENANT_ERROR: "tenantError";
        static readonly STACK_TRACE: "stackTrace";
        static readonly MAJOR_ERROR_CODE: "majorErrorCode";
        static readonly MESSAGE: "message";
        static readonly MINOR_ERROR_CODE: "minorErrorCode";
        static readonly VENDOR_SPECIFIC_ERROR_CODE: "vendorSpecificErrorCode";
    }
}
