import { ResourceReferenceType } from "./ResourceReferenceType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ResourceEntitiesType extends VCloudExtensibleType {
    resourceEntity?: ResourceReferenceType[];
}
export declare namespace ResourceEntitiesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly RESOURCE_ENTITY: "resourceEntity";
    }
}
