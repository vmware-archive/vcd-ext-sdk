import { IdentifiableResourceType } from "./../IdentifiableResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class AdminFileDescriptorType extends IdentifiableResourceType {
    description?: string;
    file?: ReferenceType;
}
export declare namespace AdminFileDescriptorType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly FILE: "file";
    }
}
