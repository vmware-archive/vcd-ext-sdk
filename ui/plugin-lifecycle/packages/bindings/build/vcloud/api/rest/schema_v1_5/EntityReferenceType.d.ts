import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class EntityReferenceType extends VCloudExtensibleType {
    id?: string;
    name?: string;
    type?: string;
}
export declare namespace EntityReferenceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ID: "id";
        static readonly NAME: "name";
        static readonly TYPE: "type";
    }
}
