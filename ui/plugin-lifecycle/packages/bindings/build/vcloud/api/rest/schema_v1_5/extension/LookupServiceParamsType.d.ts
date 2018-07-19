import { LookupServiceSettingsType } from "./LookupServiceSettingsType";
export declare class LookupServiceParamsType extends LookupServiceSettingsType {
    vcdUrl?: string;
    password?: string;
    userName?: string;
}
export declare namespace LookupServiceParamsType {
    class Fields extends LookupServiceSettingsType.Fields {
        static readonly VCD_URL: "vcdUrl";
        static readonly PASSWORD: "password";
        static readonly USER_NAME: "userName";
    }
}
