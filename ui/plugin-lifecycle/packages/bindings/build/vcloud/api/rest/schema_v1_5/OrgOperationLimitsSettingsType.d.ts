import { ResourceType } from "./ResourceType";
export declare class OrgOperationLimitsSettingsType extends ResourceType {
    consolesPerVmLimit?: number;
    operationsPerUser?: number;
    operationsPerOrg?: number;
    queuedOperationsPerUser?: number;
    queuedOperationsPerOrg?: number;
}
export declare namespace OrgOperationLimitsSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly CONSOLES_PER_VM_LIMIT: "consolesPerVmLimit";
        static readonly OPERATIONS_PER_USER: "operationsPerUser";
        static readonly OPERATIONS_PER_ORG: "operationsPerOrg";
        static readonly QUEUED_OPERATIONS_PER_USER: "queuedOperationsPerUser";
        static readonly QUEUED_OPERATIONS_PER_ORG: "queuedOperationsPerOrg";
    }
}
