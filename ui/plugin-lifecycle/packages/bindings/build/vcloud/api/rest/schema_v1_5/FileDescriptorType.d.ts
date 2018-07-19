import { IdentifiableResourceType } from "./IdentifiableResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class FileDescriptorType extends IdentifiableResourceType {
    description?: string;
    file?: ReferenceType;
}
export declare namespace FileDescriptorType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly FILE: "file";
    }
}
