import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class OwnerType extends ResourceType {
    user?: ReferenceType;
}
export declare namespace OwnerType {
    class Fields extends ResourceType.Fields {
        static readonly USER: "user";
    }
}
