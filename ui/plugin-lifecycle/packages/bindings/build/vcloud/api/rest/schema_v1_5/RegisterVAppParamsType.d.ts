import { NicIpMapType } from "./NicIpMapType";
import { OvfToVdcNetworkMapType } from "./OvfToVdcNetworkMapType";
import { VsToVmxMapType } from "./VsToVmxMapType";
import { ExternalNatIpMapType } from "./ExternalNatIpMapType";
import { ParamsType } from "./ParamsType";
export declare class RegisterVAppParamsType extends ParamsType {
    ovf?: string;
    vsToVmxMap?: VsToVmxMapType;
    ovfToVdcNetworkMap?: OvfToVdcNetworkMapType;
    externalNatIpMap?: ExternalNatIpMapType;
    nicIpMap?: NicIpMapType;
}
export declare namespace RegisterVAppParamsType {
    class Fields extends ParamsType.Fields {
        static readonly OVF: "ovf";
        static readonly VS_TO_VMX_MAP: "vsToVmxMap";
        static readonly OVF_TO_VDC_NETWORK_MAP: "ovfToVdcNetworkMap";
        static readonly EXTERNAL_NAT_IP_MAP: "externalNatIpMap";
        static readonly NIC_IP_MAP: "nicIpMap";
    }
}
