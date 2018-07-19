import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ComplianceResultType extends VCloudExtensibleType {
    complianceStatus?: string;
    complianceStatusMessage?: string;
    complianceCheckTime?: Date;
}
export declare namespace ComplianceResultType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly COMPLIANCE_STATUS: "complianceStatus";
        static readonly COMPLIANCE_STATUS_MESSAGE: "complianceStatusMessage";
        static readonly COMPLIANCE_CHECK_TIME: "complianceCheckTime";
    }
}
