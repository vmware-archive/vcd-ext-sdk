import { VAppCreationParamsType } from "./VAppCreationParamsType";
import { InstantiateOvfPropertyType } from "./InstantiateOvfPropertyType";
import { InstantiateVmParamsType } from "./InstantiateVmParamsType";
import { NetworkMappingType } from "./NetworkMappingType";
export declare class InstantiateOvfParamsType extends VAppCreationParamsType {
    allEULAsAccepted?: boolean;
    removeNonStandardOvfExtensions?: boolean;
    networkMapping?: NetworkMappingType[];
    instantiateOvfProperty?: InstantiateOvfPropertyType[];
    instantiateVmParams?: InstantiateVmParamsType[];
    transferFormat?: string;
}
export declare namespace InstantiateOvfParamsType {
    class Fields extends VAppCreationParamsType.Fields {
        static readonly ALL_EU_LAS_ACCEPTED: "allEULAsAccepted";
        static readonly REMOVE_NON_STANDARD_OVF_EXTENSIONS: "removeNonStandardOvfExtensions";
        static readonly NETWORK_MAPPING: "networkMapping";
        static readonly INSTANTIATE_OVF_PROPERTY: "instantiateOvfProperty";
        static readonly INSTANTIATE_VM_PARAMS: "instantiateVmParams";
        static readonly TRANSFER_FORMAT: "transferFormat";
    }
}
