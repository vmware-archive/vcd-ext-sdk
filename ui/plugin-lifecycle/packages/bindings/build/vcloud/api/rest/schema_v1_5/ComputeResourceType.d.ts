import { ResourceSharesLevelType } from "./ResourceSharesLevelType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ComputeResourceType extends VCloudExtensibleType {
    configured?: number;
    reservation?: number;
    limit?: number;
    sharesLevel?: ResourceSharesLevelType;
    shares?: number;
}
export declare namespace ComputeResourceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CONFIGURED: "configured";
        static readonly RESERVATION: "reservation";
        static readonly LIMIT: "limit";
        static readonly SHARES_LEVEL: "sharesLevel";
        static readonly SHARES: "shares";
    }
}
