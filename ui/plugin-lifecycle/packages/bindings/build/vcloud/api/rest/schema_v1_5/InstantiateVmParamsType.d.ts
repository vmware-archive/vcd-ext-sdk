import { NetworkConnectionSectionType } from "./NetworkConnectionSectionType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { InstantiateVmHardwareCustomizationParamsType } from "./InstantiateVmHardwareCustomizationParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class InstantiateVmParamsType extends VCloudExtensibleType {
    networkConnectionSection?: NetworkConnectionSectionType;
    computerName?: string;
    vdcStorageProfile?: ReferenceType;
    hardwareCustomization?: InstantiateVmHardwareCustomizationParamsType;
    id?: string;
}
export declare namespace InstantiateVmParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK_CONNECTION_SECTION: "networkConnectionSection";
        static readonly COMPUTER_NAME: "computerName";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly HARDWARE_CUSTOMIZATION: "hardwareCustomization";
        static readonly ID: "id";
    }
}
