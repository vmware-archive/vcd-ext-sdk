import { EntityType } from "./EntityType";
export declare class FileType extends EntityType {
    bytesTransferred?: number;
    checksum?: string;
    size?: number;
}
export declare namespace FileType {
    class Fields extends EntityType.Fields {
        static readonly BYTES_TRANSFERRED: "bytesTransferred";
        static readonly CHECKSUM: "checksum";
        static readonly SIZE: "size";
    }
}
