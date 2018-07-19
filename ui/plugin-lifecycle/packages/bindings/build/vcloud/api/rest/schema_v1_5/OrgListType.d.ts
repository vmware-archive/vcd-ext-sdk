import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class OrgListType extends ResourceType {
    org?: ReferenceType[];
}
export declare namespace OrgListType {
    class Fields extends ResourceType.Fields {
        static readonly ORG: "org";
    }
}
