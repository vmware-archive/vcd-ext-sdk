import { ResourceType } from "./ResourceType";
export declare class QueryResultType extends ResourceType {
    name?: string;
    page?: number;
    pageSize?: number;
}
export declare namespace QueryResultType {
    class Fields extends ResourceType.Fields {
        static readonly NAME: "name";
        static readonly PAGE: "page";
        static readonly PAGE_SIZE: "pageSize";
    }
}
