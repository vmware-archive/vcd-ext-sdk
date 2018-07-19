import { EntityType } from "./../EntityType";
import { ReferenceType } from "./../ReferenceType";
export declare class ServiceResourceType extends EntityType {
    org?: ReferenceType;
    externalObjectId?: string;
}
export declare namespace ServiceResourceType {
    class Fields extends EntityType.Fields {
        static readonly ORG: "org";
        static readonly EXTERNAL_OBJECT_ID: "externalObjectId";
    }
}
