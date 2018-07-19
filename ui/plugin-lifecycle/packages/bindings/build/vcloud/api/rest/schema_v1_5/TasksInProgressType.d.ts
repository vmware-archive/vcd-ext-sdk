import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { TaskType } from "./TaskType";
export declare class TasksInProgressType extends VCloudExtensibleType {
    task?: TaskType[];
}
export declare namespace TasksInProgressType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TASK: "task";
    }
}
