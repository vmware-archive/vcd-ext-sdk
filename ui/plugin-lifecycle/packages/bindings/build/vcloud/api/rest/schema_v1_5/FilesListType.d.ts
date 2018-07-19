import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { FileType } from "./FileType";
export declare class FilesListType extends VCloudExtensibleType {
    file?: FileType[];
}
export declare namespace FilesListType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly FILE: "file";
    }
}
