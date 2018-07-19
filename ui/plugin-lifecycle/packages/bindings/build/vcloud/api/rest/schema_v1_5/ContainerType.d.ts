import { ResourceType } from "./ResourceType";
export declare class ContainerType extends ResourceType {
    name?: string;
    page?: number;
    pageSize?: number;
    total?: number;
}
export declare namespace ContainerType {
    class Fields extends ResourceType.Fields {
        static readonly NAME: "name";
        static readonly PAGE: "page";
        static readonly PAGE_SIZE: "pageSize";
        static readonly TOTAL: "total";
    }
}
