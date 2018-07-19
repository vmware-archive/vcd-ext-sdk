import { EntityReferenceType } from "./EntityReferenceType";
export declare class EntityLinkType extends EntityReferenceType {
    rel?: string;
}
export declare namespace EntityLinkType {
    class Fields extends EntityReferenceType.Fields {
        static readonly REL: "rel";
    }
}
