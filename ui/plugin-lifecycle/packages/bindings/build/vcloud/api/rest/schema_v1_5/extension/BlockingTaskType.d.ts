import { TaskRequestBaseType } from "./../TaskRequestBaseType";
export declare class BlockingTaskType extends TaskRequestBaseType {
    status?: string;
}
export declare namespace BlockingTaskType {
    class Fields extends TaskRequestBaseType.Fields {
        static readonly STATUS: "status";
    }
}
