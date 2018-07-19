import { EntityType } from "./EntityType";
import { UsersListType } from "./UsersListType";
import { ReferenceType } from "./ReferenceType";
export declare class GroupType extends EntityType {
    nameInSource?: string;
    usersList?: UsersListType;
    providerType?: string;
    role?: ReferenceType;
}
export declare namespace GroupType {
    class Fields extends EntityType.Fields {
        static readonly NAME_IN_SOURCE: "nameInSource";
        static readonly USERS_LIST: "usersList";
        static readonly PROVIDER_TYPE: "providerType";
        static readonly ROLE: "role";
    }
}
