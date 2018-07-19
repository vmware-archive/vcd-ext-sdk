import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ExternalSubjectType extends VCloudExtensibleType {
    subjectId?: string;
    isUser?: boolean;
    idpType?: string;
}
export declare namespace ExternalSubjectType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SUBJECT_ID: "subjectId";
        static readonly IS_USER: "isUser";
        static readonly IDP_TYPE: "idpType";
    }
}
