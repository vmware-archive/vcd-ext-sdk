import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class UndeployVAppParamsType extends VCloudExtensibleType {
    undeployPowerAction?: string;
}
export declare namespace UndeployVAppParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly UNDEPLOY_POWER_ACTION: "undeployPowerAction";
    }
}
