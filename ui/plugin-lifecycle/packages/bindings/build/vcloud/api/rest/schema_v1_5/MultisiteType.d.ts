import { EntityType } from "./EntityType";
export declare abstract class MultisiteType extends EntityType {
    restEndpoint?: string;
    tenantUiEndpoint?: string;
    restEndpointCertificate?: string;
}
export declare namespace MultisiteType {
    class Fields extends EntityType.Fields {
        static readonly REST_ENDPOINT: "restEndpoint";
        static readonly TENANT_UI_ENDPOINT: "tenantUiEndpoint";
        static readonly REST_ENDPOINT_CERTIFICATE: "restEndpointCertificate";
    }
}
