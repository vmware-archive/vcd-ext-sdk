import { VMWNetworkPoolType } from "./VMWNetworkPoolType";
import { VimObjectRefsType } from "./VimObjectRefsType";
import { ReferenceType } from "./../ReferenceType";
export declare class PortGroupPoolType extends VMWNetworkPoolType {
    portGroupRefs?: VimObjectRefsType;
    vimServer?: ReferenceType;
    usedNetworksCount?: number;
}
export declare namespace PortGroupPoolType {
    class Fields extends VMWNetworkPoolType.Fields {
        static readonly PORT_GROUP_REFS: "portGroupRefs";
        static readonly VIM_SERVER: "vimServer";
        static readonly USED_NETWORKS_COUNT: "usedNetworksCount";
    }
}
