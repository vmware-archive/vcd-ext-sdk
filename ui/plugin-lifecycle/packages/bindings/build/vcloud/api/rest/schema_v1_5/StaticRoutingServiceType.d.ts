import { StaticRouteType } from "./StaticRouteType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class StaticRoutingServiceType extends NetworkServiceType {
    staticRoute?: StaticRouteType[];
}
export declare namespace StaticRoutingServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly STATIC_ROUTE: "staticRoute";
    }
}
