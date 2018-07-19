import { FilesListType } from "./FilesListType";
import { EntityType } from "./EntityType";
export declare class ResourceEntityType extends EntityType {
    files?: FilesListType;
    status?: number;
}
export declare namespace ResourceEntityType {
    class Fields extends EntityType.Fields {
        static readonly FILES: "files";
        static readonly STATUS: "status";
    }
}
