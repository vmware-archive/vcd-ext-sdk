import { CIMResourceAllocationSettingDataType } from "./CIMResourceAllocationSettingDataType";
export declare class RASDType extends CIMResourceAllocationSettingDataType {
    bound?: string;
    configuration?: string;
    required?: boolean;
}
export declare namespace RASDType {
    class Fields extends CIMResourceAllocationSettingDataType.Fields {
        static readonly BOUND: "bound";
        static readonly CONFIGURATION: "configuration";
        static readonly REQUIRED: "required";
    }
}
