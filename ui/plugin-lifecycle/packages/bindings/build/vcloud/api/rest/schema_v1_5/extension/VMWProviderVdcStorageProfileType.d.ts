import { VimObjectRefType } from "./VimObjectRefType";
import { ProviderVdcStorageProfileType } from "./../ProviderVdcStorageProfileType";
export declare class VMWProviderVdcStorageProfileType extends ProviderVdcStorageProfileType {
    vimStorageProfile?: VimObjectRefType;
}
export declare namespace VMWProviderVdcStorageProfileType {
    class Fields extends ProviderVdcStorageProfileType.Fields {
        static readonly VIM_STORAGE_PROFILE: "vimStorageProfile";
    }
}
