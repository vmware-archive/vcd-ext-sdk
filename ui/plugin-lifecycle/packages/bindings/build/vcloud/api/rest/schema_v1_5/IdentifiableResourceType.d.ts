import { ResourceType } from "./ResourceType";
export declare class IdentifiableResourceType extends ResourceType {
    id?: string;
    operationKey?: string;
}
export declare namespace IdentifiableResourceType {
    class Fields extends ResourceType.Fields {
        static readonly ID: "id";
        static readonly OPERATION_KEY: "operationKey";
    }
}
