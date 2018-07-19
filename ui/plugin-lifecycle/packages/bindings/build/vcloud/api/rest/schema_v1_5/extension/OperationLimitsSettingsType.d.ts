import { ResourceType } from "./../ResourceType";
export declare class OperationLimitsSettingsType extends ResourceType {
    runningPerUser?: number;
    runningPerOrg?: number;
    queuedOperationsPerUser?: number;
    queuedOperationsPerOrg?: number;
}
export declare namespace OperationLimitsSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly RUNNING_PER_USER: "runningPerUser";
        static readonly RUNNING_PER_ORG: "runningPerOrg";
        static readonly QUEUED_OPERATIONS_PER_USER: "queuedOperationsPerUser";
        static readonly QUEUED_OPERATIONS_PER_ORG: "queuedOperationsPerOrg";
    }
}
