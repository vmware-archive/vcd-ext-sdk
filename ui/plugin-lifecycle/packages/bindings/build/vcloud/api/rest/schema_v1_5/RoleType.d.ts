import { RightReferencesType } from "./RightReferencesType";
import { EntityType } from "./EntityType";
export declare class RoleType extends EntityType {
    rightReferences?: RightReferencesType;
}
export declare namespace RoleType {
    class Fields extends EntityType.Fields {
        static readonly RIGHT_REFERENCES: "rightReferences";
    }
}
