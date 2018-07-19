import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { AccessSettingType } from "./AccessSettingType";
export declare class AccessSettingsType extends VCloudExtensibleType {
    accessSetting?: AccessSettingType[];
}
export declare namespace AccessSettingsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ACCESS_SETTING: "accessSetting";
    }
}
