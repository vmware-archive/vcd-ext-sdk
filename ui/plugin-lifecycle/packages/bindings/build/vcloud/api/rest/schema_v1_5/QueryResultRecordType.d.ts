import { LinkType } from "./LinkType";
import { MetadataType } from "./MetadataType";
export declare abstract class QueryResultRecordType {
    link?: LinkType[];
    metadata?: MetadataType;
    href?: string;
    id?: string;
    type?: string;
    otherAttributes?: object;
}
export declare namespace QueryResultRecordType {
    class Fields {
        static readonly LINK: "link";
        static readonly METADATA: "metadata";
        static readonly HREF: "href";
        static readonly ID: "id";
        static readonly TYPE: "type";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
