import { ReferenceType } from "./ReferenceType";
export declare class TaskPrototypeType {
    owner?: ReferenceType;
    operation?: string;
    operationName?: string;
}
export declare namespace TaskPrototypeType {
    class Fields {
        static readonly OWNER: "owner";
        static readonly OPERATION: "operation";
        static readonly OPERATION_NAME: "operationName";
    }
}
