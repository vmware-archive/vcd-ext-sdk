import { ResourceClassActionType } from "./ResourceClassActionType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class ResourceClassActionsType extends VCloudExtensibleType {
    resourceClassAction?: ResourceClassActionType[];
}
export declare namespace ResourceClassActionsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly RESOURCE_CLASS_ACTION: "resourceClassAction";
    }
}
