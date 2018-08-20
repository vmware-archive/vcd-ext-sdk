import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model";

export interface ChangeScopeItem {
    // Tenant name
    orgName: string;
    // Plugin name
    plugin: UiPluginMetadataResponse;
    // Action name
    action: string;
}
