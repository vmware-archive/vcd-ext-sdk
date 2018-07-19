import { TenantSyslogServerSettingsType } from "./TenantSyslogServerSettingsType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class SyslogServerType extends VCloudExtensibleType {
    tenantSyslogServerSettings?: TenantSyslogServerSettingsType;
}
export declare namespace SyslogServerType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TENANT_SYSLOG_SERVER_SETTINGS: "tenantSyslogServerSettings";
    }
}
