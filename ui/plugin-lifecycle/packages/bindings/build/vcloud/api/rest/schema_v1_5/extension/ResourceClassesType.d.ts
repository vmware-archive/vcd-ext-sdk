import { ResourceClassType } from "./ResourceClassType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class ResourceClassesType extends VCloudExtensibleType {
    resourceClass?: ResourceClassType[];
}
export declare namespace ResourceClassesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly RESOURCE_CLASS: "resourceClass";
    }
}
