import { BlockingTaskOperationParamsType } from "./BlockingTaskOperationParamsType";
export declare class BlockingTaskUpdateProgressParamsType extends BlockingTaskOperationParamsType {
    timeoutValueInMilliseconds?: number;
}
export declare namespace BlockingTaskUpdateProgressParamsType {
    class Fields extends BlockingTaskOperationParamsType.Fields {
        static readonly TIMEOUT_VALUE_IN_MILLISECONDS: "timeoutValueInMilliseconds";
    }
}
