import { ContainerType } from "./ContainerType";
import { FromCloudTunnelListenerType } from "./FromCloudTunnelListenerType";
export declare class FromCloudTunnelListenerListType extends ContainerType {
    fromCloudTunnelListener?: FromCloudTunnelListenerType[];
}
export declare namespace FromCloudTunnelListenerListType {
    class Fields extends ContainerType.Fields {
        static readonly FROM_CLOUD_TUNNEL_LISTENER: "fromCloudTunnelListener";
    }
}
