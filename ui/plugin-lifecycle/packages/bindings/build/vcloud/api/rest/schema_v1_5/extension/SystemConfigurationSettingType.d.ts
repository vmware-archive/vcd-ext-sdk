import { ResourceType } from "./../ResourceType";
export declare class SystemConfigurationSettingType extends ResourceType {
    name?: string;
    section?: string;
    value?: string;
}
export declare namespace SystemConfigurationSettingType {
    class Fields extends ResourceType.Fields {
        static readonly NAME: "name";
        static readonly SECTION: "section";
        static readonly VALUE: "value";
    }
}
