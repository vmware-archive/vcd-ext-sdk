import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ReferenceType extends VCloudExtensibleType {
    href?: string;
    id?: string;
    name?: string;
    type?: string;
}
export declare namespace ReferenceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly HREF: "href";
        static readonly ID: "id";
        static readonly NAME: "name";
        static readonly TYPE: "type";
    }
}
