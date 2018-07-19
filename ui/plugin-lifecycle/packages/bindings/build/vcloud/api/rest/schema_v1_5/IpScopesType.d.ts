import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { IpScopeType } from "./IpScopeType";
export declare class IpScopesType extends VCloudExtensibleType {
    ipScope?: IpScopeType[];
}
export declare namespace IpScopesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IP_SCOPE: "ipScope";
    }
}
