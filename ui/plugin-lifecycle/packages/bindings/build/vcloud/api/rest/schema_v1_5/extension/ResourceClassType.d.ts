import { ResourceClassActionsType } from "./ResourceClassActionsType";
import { EntityType } from "./../EntityType";
import { ServiceResourcesType } from "./ServiceResourcesType";
export declare class ResourceClassType extends EntityType {
    mimeType?: string;
    urlTemplate?: string;
    nid?: string;
    urnPattern?: string;
    serviceResources?: ServiceResourcesType;
    resourceClassActions?: ResourceClassActionsType;
}
export declare namespace ResourceClassType {
    class Fields extends EntityType.Fields {
        static readonly MIME_TYPE: "mimeType";
        static readonly URL_TEMPLATE: "urlTemplate";
        static readonly NID: "nid";
        static readonly URN_PATTERN: "urnPattern";
        static readonly SERVICE_RESOURCES: "serviceResources";
        static readonly RESOURCE_CLASS_ACTIONS: "resourceClassActions";
    }
}
