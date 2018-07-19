import { VMWNetworkPoolType } from "./VMWNetworkPoolType";
import { VimObjectRefType } from "./VimObjectRefType";
import { NumericRangeType } from "./NumericRangeType";
export declare class VlanPoolType extends VMWNetworkPoolType {
    vlanRange?: NumericRangeType[];
    vimSwitchRef?: VimObjectRefType;
    usedNetworksCount?: number;
    promiscuousMode?: boolean;
}
export declare namespace VlanPoolType {
    class Fields extends VMWNetworkPoolType.Fields {
        static readonly VLAN_RANGE: "vlanRange";
        static readonly VIM_SWITCH_REF: "vimSwitchRef";
        static readonly USED_NETWORKS_COUNT: "usedNetworksCount";
        static readonly PROMISCUOUS_MODE: "promiscuousMode";
    }
}
