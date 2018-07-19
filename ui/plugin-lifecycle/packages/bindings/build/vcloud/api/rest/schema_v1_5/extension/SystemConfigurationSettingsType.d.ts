import { ResourceType } from "./../ResourceType";
import { SystemConfigurationSettingType } from "./SystemConfigurationSettingType";
export declare class SystemConfigurationSettingsType extends ResourceType {
    settings?: SystemConfigurationSettingType[];
}
export declare namespace SystemConfigurationSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly SETTINGS: "settings";
    }
}
