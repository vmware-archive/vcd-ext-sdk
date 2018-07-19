import { ParamsType } from "./../ParamsType";
import { DatastoresType } from "./DatastoresType";
import { OrgsType } from "./../OrgsType";
export declare class TenantMigrationParamsType extends ParamsType {
    orgs?: OrgsType;
    sourceDatastores?: DatastoresType;
    targetDatastores?: DatastoresType;
}
export declare namespace TenantMigrationParamsType {
    class Fields extends ParamsType.Fields {
        static readonly ORGS: "orgs";
        static readonly SOURCE_DATASTORES: "sourceDatastores";
        static readonly TARGET_DATASTORES: "targetDatastores";
    }
}
