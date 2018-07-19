import { ResourceType } from "./ResourceType";
export declare class TaskOperationListType extends ResourceType {
    operation?: string[];
}
export declare namespace TaskOperationListType {
    class Fields extends ResourceType.Fields {
        static readonly OPERATION: "operation";
    }
}
