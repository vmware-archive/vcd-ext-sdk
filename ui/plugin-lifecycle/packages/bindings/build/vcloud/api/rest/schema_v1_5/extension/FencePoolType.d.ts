import { VMWNetworkPoolType } from "./VMWNetworkPoolType";
import { VimObjectRefType } from "./VimObjectRefType";
export declare class FencePoolType extends VMWNetworkPoolType {
    fenceIdCount?: number;
    vlanId?: number;
    vimSwitchRef?: VimObjectRefType;
    usedNetworksCount?: number;
    promiscuousMode?: boolean;
    mtu?: number;
}
export declare namespace FencePoolType {
    class Fields extends VMWNetworkPoolType.Fields {
        static readonly FENCE_ID_COUNT: "fenceIdCount";
        static readonly VLAN_ID: "vlanId";
        static readonly VIM_SWITCH_REF: "vimSwitchRef";
        static readonly USED_NETWORKS_COUNT: "usedNetworksCount";
        static readonly PROMISCUOUS_MODE: "promiscuousMode";
        static readonly MTU: "mtu";
    }
}
