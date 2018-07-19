import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class BundleUploadParamsType extends VCloudExtensibleType {
    fileSize?: number;
    serviceNamespace?: string;
}
export declare namespace BundleUploadParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly FILE_SIZE: "fileSize";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
    }
}
