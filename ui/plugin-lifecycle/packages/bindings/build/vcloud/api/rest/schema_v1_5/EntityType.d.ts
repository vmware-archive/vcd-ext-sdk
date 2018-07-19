import { TasksInProgressType } from "./TasksInProgressType";
import { IdentifiableResourceType } from "./IdentifiableResourceType";
export declare class EntityType extends IdentifiableResourceType {
    description?: string;
    tasks?: TasksInProgressType;
    name?: string;
}
export declare namespace EntityType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly TASKS: "tasks";
        static readonly NAME: "name";
    }
}
