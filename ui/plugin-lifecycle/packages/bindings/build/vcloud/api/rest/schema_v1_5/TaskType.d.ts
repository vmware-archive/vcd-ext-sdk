import { ResultType } from "./ResultType";
import { EntityType } from "./EntityType";
import { ErrorType } from "./ErrorType";
import { ReferenceType } from "./ReferenceType";
export declare class TaskType extends EntityType {
    owner?: ReferenceType;
    error?: ErrorType;
    user?: ReferenceType;
    organization?: ReferenceType;
    progress?: number;
    params?: object;
    details?: string;
    result?: ResultType;
    cancelRequested?: boolean;
    endTime?: Date;
    expiryTime?: Date;
    operation?: string;
    operationName?: string;
    serviceNamespace?: string;
    startTime?: Date;
    status?: string;
}
export declare namespace TaskType {
    class Fields extends EntityType.Fields {
        static readonly OWNER: "owner";
        static readonly ERROR: "error";
        static readonly USER: "user";
        static readonly ORGANIZATION: "organization";
        static readonly PROGRESS: "progress";
        static readonly PARAMS: "params";
        static readonly DETAILS: "details";
        static readonly RESULT: "result";
        static readonly CANCEL_REQUESTED: "cancelRequested";
        static readonly END_TIME: "endTime";
        static readonly EXPIRY_TIME: "expiryTime";
        static readonly OPERATION: "operation";
        static readonly OPERATION_NAME: "operationName";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly START_TIME: "startTime";
        static readonly STATUS: "status";
    }
}
