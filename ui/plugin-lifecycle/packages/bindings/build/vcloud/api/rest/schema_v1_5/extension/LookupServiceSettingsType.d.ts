import { ResourceType } from "./../ResourceType";
export declare class LookupServiceSettingsType extends ResourceType {
    lookupServiceUrl?: string;
}
export declare namespace LookupServiceSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly LOOKUP_SERVICE_URL: "lookupServiceUrl";
    }
}
