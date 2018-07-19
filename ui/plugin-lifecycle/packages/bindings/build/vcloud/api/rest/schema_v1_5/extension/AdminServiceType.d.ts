import { ResourceClassesType } from "./ResourceClassesType";
import { EntityType } from "./../EntityType";
import { AdminServiceLinksType } from "./AdminServiceLinksType";
import { ApiFiltersType } from "./ApiFiltersType";
import { AdminApiDefinitionsType } from "./AdminApiDefinitionsType";
export declare class AdminServiceType extends EntityType {
    namespace?: string;
    enabled?: boolean;
    authorizationEnabled?: boolean;
    routingKey?: string;
    priority?: number;
    exchange?: string;
    vendor?: string;
    apiFilters?: ApiFiltersType;
    serviceLinks?: AdminServiceLinksType;
    apiDefinitions?: AdminApiDefinitionsType;
    resourceClasses?: ResourceClassesType;
}
export declare namespace AdminServiceType {
    class Fields extends EntityType.Fields {
        static readonly NAMESPACE: "namespace";
        static readonly ENABLED: "enabled";
        static readonly AUTHORIZATION_ENABLED: "authorizationEnabled";
        static readonly ROUTING_KEY: "routingKey";
        static readonly PRIORITY: "priority";
        static readonly EXCHANGE: "exchange";
        static readonly VENDOR: "vendor";
        static readonly API_FILTERS: "apiFilters";
        static readonly SERVICE_LINKS: "serviceLinks";
        static readonly API_DEFINITIONS: "apiDefinitions";
        static readonly RESOURCE_CLASSES: "resourceClasses";
    }
}
