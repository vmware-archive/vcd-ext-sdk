import { LoadBalancerPoolType } from "./LoadBalancerPoolType";
import { LoadBalancerVirtualServerType } from "./LoadBalancerVirtualServerType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class LoadBalancerServiceType extends NetworkServiceType {
    pool?: LoadBalancerPoolType[];
    virtualServer?: LoadBalancerVirtualServerType[];
}
export declare namespace LoadBalancerServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly POOL: "pool";
        static readonly VIRTUAL_SERVER: "virtualServer";
    }
}
