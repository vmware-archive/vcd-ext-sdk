import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class GroupsListType extends VCloudExtensibleType {
    groupReference?: ReferenceType[];
}
export declare namespace GroupsListType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly GROUP_REFERENCE: "groupReference";
    }
}
