import { QueryResultAdminServiceRecordType, VCloudExtensionType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

export interface QueryResultAdminServiceRecords {
    href: string;
    link: {
        href: string;
        id: string;
        name: string;
        otherAttributes: object;
        rel: string;
        type: string;
        vcloudExtension: VCloudExtensionType[];
    }[];
    name: string;
    otherAttributes: object;
    page: number;
    pageSize: number;
    record: QueryResultAdminServiceRecordType[];
    total: number;
    type: string;
    vcloudExtension: VCloudExtensionType[];
}
