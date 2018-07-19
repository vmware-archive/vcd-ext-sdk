import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { TaskType } from "./TaskType";
export declare class FileUploadSocketType extends VCloudExtensibleType {
    task?: TaskType;
    uploadLocation?: string;
}
export declare namespace FileUploadSocketType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TASK: "task";
        static readonly UPLOAD_LOCATION: "uploadLocation";
    }
}
