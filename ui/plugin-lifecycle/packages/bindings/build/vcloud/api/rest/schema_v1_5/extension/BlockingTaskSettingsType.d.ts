import { ResourceType } from "./../ResourceType";
import { TaskOperationListType } from "./../TaskOperationListType";
export declare class BlockingTaskSettingsType extends ResourceType {
    timeoutAction?: string;
    blockingTaskOperations?: TaskOperationListType;
    timeoutInMilliseconds?: number;
}
export declare namespace BlockingTaskSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly TIMEOUT_ACTION: "timeoutAction";
        static readonly BLOCKING_TASK_OPERATIONS: "blockingTaskOperations";
        static readonly TIMEOUT_IN_MILLISECONDS: "timeoutInMilliseconds";
    }
}
