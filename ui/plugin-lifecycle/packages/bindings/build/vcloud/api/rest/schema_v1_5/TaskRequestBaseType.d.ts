import { EntityType } from "./EntityType";
import { ReferenceType } from "./ReferenceType";
export declare class TaskRequestBaseType extends EntityType {
    organization?: ReferenceType;
    user?: ReferenceType;
    taskOwner?: ReferenceType;
    createdTime?: Date;
    timeoutAction?: string;
    timeoutDate?: Date;
}
export declare namespace TaskRequestBaseType {
    class Fields extends EntityType.Fields {
        static readonly ORGANIZATION: "organization";
        static readonly USER: "user";
        static readonly TASK_OWNER: "taskOwner";
        static readonly CREATED_TIME: "createdTime";
        static readonly TIMEOUT_ACTION: "timeoutAction";
        static readonly TIMEOUT_DATE: "timeoutDate";
    }
}
