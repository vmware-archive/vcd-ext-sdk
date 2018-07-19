import { VMWNetworkPoolType } from "./VMWNetworkPoolType";
import { VimObjectRefType } from "./VimObjectRefType";
import { VdsContextType } from "./VdsContextType";
export declare class VxlanPoolType extends VMWNetworkPoolType {
    vimSwitchRef?: VimObjectRefType;
    transportZoneRef?: VimObjectRefType;
    usedNetworksCount?: number;
    promiscuousMode?: boolean;
    vdsContexts?: VdsContextType[];
}
export declare namespace VxlanPoolType {
    class Fields extends VMWNetworkPoolType.Fields {
        static readonly VIM_SWITCH_REF: "vimSwitchRef";
        static readonly TRANSPORT_ZONE_REF: "transportZoneRef";
        static readonly USED_NETWORKS_COUNT: "usedNetworksCount";
        static readonly PROMISCUOUS_MODE: "promiscuousMode";
        static readonly VDS_CONTEXTS: "vdsContexts";
    }
}
