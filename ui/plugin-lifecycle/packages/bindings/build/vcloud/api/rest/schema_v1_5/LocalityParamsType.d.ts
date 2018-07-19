import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class LocalityParamsType extends VCloudExtensibleType {
    resourceEntity?: ReferenceType[];
}
export declare namespace LocalityParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly RESOURCE_ENTITY: "resourceEntity";
    }
}
