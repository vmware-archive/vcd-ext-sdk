import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { ReferenceType } from "./../ReferenceType";
export declare class AclAccessType extends VCloudExtensibleType {
    access?: string;
    entity?: ReferenceType;
}
export declare namespace AclAccessType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ACCESS: "access";
        static readonly ENTITY: "entity";
    }
}
