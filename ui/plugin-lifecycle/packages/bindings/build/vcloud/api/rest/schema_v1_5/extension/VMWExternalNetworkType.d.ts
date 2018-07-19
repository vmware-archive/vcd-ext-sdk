import { VimObjectRefType } from "./VimObjectRefType";
import { NetworkType } from "./../NetworkType";
import { VimObjectRefsType } from "./VimObjectRefsType";
export declare class VMWExternalNetworkType extends NetworkType {
    vimPortGroupRef?: VimObjectRefType;
    vimPortGroupRefs?: VimObjectRefsType;
}
export declare namespace VMWExternalNetworkType {
    class Fields extends NetworkType.Fields {
        static readonly VIM_PORT_GROUP_REF: "vimPortGroupRef";
        static readonly VIM_PORT_GROUP_REFS: "vimPortGroupRefs";
    }
}
