import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class OrgsType extends ResourceType {
    org?: ReferenceType[];
}
export declare namespace OrgsType {
    class Fields extends ResourceType.Fields {
        static readonly ORG: "org";
    }
}
