import { RightRefsType } from "./RightRefsType";
import { ReferenceType } from "./../ReferenceType";
export declare class EntityRightsType {
    reference?: ReferenceType;
    rights?: RightRefsType;
}
export declare namespace EntityRightsType {
    class Fields {
        static readonly REFERENCE: "reference";
        static readonly RIGHTS: "rights";
    }
}
