import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class UsersListType extends VCloudExtensibleType {
    userReference?: ReferenceType[];
}
export declare namespace UsersListType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly USER_REFERENCE: "userReference";
    }
}
