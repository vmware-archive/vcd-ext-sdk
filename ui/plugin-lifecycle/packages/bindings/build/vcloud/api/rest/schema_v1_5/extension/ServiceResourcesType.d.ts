import { ServiceResourceType } from "./ServiceResourceType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class ServiceResourcesType extends VCloudExtensibleType {
    serviceResource?: ServiceResourceType[];
}
export declare namespace ServiceResourcesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SERVICE_RESOURCE: "serviceResource";
    }
}
