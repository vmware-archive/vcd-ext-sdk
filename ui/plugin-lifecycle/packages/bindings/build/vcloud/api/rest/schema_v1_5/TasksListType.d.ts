import { EntityType } from "./EntityType";
import { TaskType } from "./TaskType";
export declare class TasksListType extends EntityType {
    task?: TaskType[];
}
export declare namespace TasksListType {
    class Fields extends EntityType.Fields {
        static readonly TASK: "task";
    }
}
