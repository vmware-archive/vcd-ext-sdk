import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class FileUploadParamsType extends VCloudExtensibleType {
    fileSize?: number;
}
export declare namespace FileUploadParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly FILE_SIZE: "fileSize";
    }
}
