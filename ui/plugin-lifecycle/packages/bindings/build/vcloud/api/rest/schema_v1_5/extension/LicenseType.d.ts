import { ResourceType } from "./../ResourceType";
import { LicenseMetricsInfoType } from "./LicenseMetricsInfoType";
export declare class LicenseType extends ResourceType {
    serialNumber?: string;
    licensedVMCount?: number;
    expirationDate?: Date;
    validSerial?: boolean;
    expired?: boolean;
    persisted?: boolean;
    publishingToRemoteSitesFeature?: boolean;
    subscribingToRemoteSitesFeature?: boolean;
    licenseMetricsInfo?: LicenseMetricsInfoType;
}
export declare namespace LicenseType {
    class Fields extends ResourceType.Fields {
        static readonly SERIAL_NUMBER: "serialNumber";
        static readonly LICENSED_VM_COUNT: "licensedVMCount";
        static readonly EXPIRATION_DATE: "expirationDate";
        static readonly VALID_SERIAL: "validSerial";
        static readonly EXPIRED: "expired";
        static readonly PERSISTED: "persisted";
        static readonly PUBLISHING_TO_REMOTE_SITES_FEATURE: "publishingToRemoteSitesFeature";
        static readonly SUBSCRIBING_TO_REMOTE_SITES_FEATURE: "subscribingToRemoteSitesFeature";
        static readonly LICENSE_METRICS_INFO: "licenseMetricsInfo";
    }
}
