import { EntityType } from "./EntityType";
export declare class OrgType extends EntityType {
    fullName?: string;
    isEnabled?: boolean;
}
export declare namespace OrgType {
    class Fields extends EntityType.Fields {
        static readonly FULL_NAME: "fullName";
        static readonly IS_ENABLED: "isEnabled";
    }
}
