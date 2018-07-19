import { ResourceType } from "./../ResourceType";
import { RealmType } from "./RealmType";
export declare class KerberosSettingsType extends ResourceType {
    realm?: RealmType[];
    allowLowerCaseRealms?: boolean;
}
export declare namespace KerberosSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly REALM: "realm";
        static readonly ALLOW_LOWER_CASE_REALMS: "allowLowerCaseRealms";
    }
}
