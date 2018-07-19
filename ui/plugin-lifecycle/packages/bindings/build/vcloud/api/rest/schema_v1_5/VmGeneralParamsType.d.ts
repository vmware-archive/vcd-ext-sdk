import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class VmGeneralParamsType extends VCloudExtensibleType {
    name?: string;
    description?: string;
    needsCustomization?: boolean;
    regenerateBiosUuid?: boolean;
}
export declare namespace VmGeneralParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly DESCRIPTION: "description";
        static readonly NEEDS_CUSTOMIZATION: "needsCustomization";
        static readonly REGENERATE_BIOS_UUID: "regenerateBiosUuid";
    }
}
