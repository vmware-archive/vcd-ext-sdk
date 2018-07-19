import { AdminFileDescriptorType } from "./AdminFileDescriptorType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class AdminFileDescriptorsType extends VCloudExtensibleType {
    fileDescriptor?: AdminFileDescriptorType[];
}
export declare namespace AdminFileDescriptorsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly FILE_DESCRIPTOR: "fileDescriptor";
    }
}
