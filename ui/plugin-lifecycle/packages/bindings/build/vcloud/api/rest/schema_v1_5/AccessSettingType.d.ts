import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ExternalSubjectType } from "./ExternalSubjectType";
import { ReferenceType } from "./ReferenceType";
export declare class AccessSettingType extends VCloudExtensibleType {
    subject?: ReferenceType;
    externalSubject?: ExternalSubjectType;
    accessLevel?: string;
}
export declare namespace AccessSettingType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SUBJECT: "subject";
        static readonly EXTERNAL_SUBJECT: "externalSubject";
        static readonly ACCESS_LEVEL: "accessLevel";
    }
}
