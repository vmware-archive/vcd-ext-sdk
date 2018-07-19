import { VCloudExtensionType } from "./VCloudExtensionType";
export declare abstract class VCloudExtensibleType {
    vCloudExtension?: VCloudExtensionType[];
    otherAttributes?: object;
}
export declare namespace VCloudExtensibleType {
    class Fields {
        static readonly V_CLOUD_EXTENSION: "vCloudExtension";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
