import { DhcpPoolServiceType } from "./DhcpPoolServiceType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class GatewayDhcpServiceType extends NetworkServiceType {
    pool?: DhcpPoolServiceType[];
}
export declare namespace GatewayDhcpServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly POOL: "pool";
    }
}
