import { ContentType } from "./ContentType";
export declare class VirtualSystemCollectionType extends ContentType {
    content?: ContentType[];
}
export declare namespace VirtualSystemCollectionType {
    class Fields extends ContentType.Fields {
        static readonly CONTENT: "content";
    }
}
