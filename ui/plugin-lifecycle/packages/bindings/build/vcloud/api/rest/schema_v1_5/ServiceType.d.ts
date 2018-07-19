import { EntityType } from "./EntityType";
export declare class ServiceType extends EntityType {
    namespace?: string;
    vendor?: string;
}
export declare namespace ServiceType {
    class Fields extends EntityType.Fields {
        static readonly NAMESPACE: "namespace";
        static readonly VENDOR: "vendor";
    }
}
