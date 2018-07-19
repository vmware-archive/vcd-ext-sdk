import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class RightRefsType extends ResourceType {
    right?: ReferenceType[];
}
export declare namespace RightRefsType {
    class Fields extends ResourceType.Fields {
        static readonly RIGHT: "right";
    }
}
