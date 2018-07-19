import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminShadowVMRecordType extends QueryResultRecordType {
    datastoreName?: string;
    isBusy?: boolean;
    isDeleted?: boolean;
    isPublished?: boolean;
    name?: string;
    org?: string;
    primaryVAppName?: string;
    primaryVAppTemplate?: string;
    primaryVM?: string;
    primaryVMCatalog?: string;
    primaryVMOwner?: string;
    primaryVmName?: string;
    shadowVApp?: string;
    status?: string;
    vcName?: string;
}
export declare namespace QueryResultAdminShadowVMRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DATASTORE_NAME: "datastoreName";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly PRIMARY_VAPP_NAME: "primaryVAppName";
        static readonly PRIMARY_VAPP_TEMPLATE: "primaryVAppTemplate";
        static readonly PRIMARY_VM: "primaryVM";
        static readonly PRIMARY_VM_CATALOG: "primaryVMCatalog";
        static readonly PRIMARY_VM_OWNER: "primaryVMOwner";
        static readonly PRIMARY_VM_NAME: "primaryVmName";
        static readonly SHADOW_VAPP: "shadowVApp";
        static readonly STATUS: "status";
        static readonly VC_NAME: "vcName";
    }
}
