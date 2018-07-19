import { SectionType } from "./../schema/ovf/SectionType";
import { ResourceEntityType } from "./ResourceEntityType";
import { ReferenceType } from "./ReferenceType";
export declare abstract class AbstractVAppType extends ResourceEntityType {
    vAppParent?: ReferenceType;
    section?: SectionType[];
    dateCreated?: Date;
    deployed?: boolean;
}
export declare namespace AbstractVAppType {
    class Fields extends ResourceEntityType.Fields {
        static readonly V_APP_PARENT: "vAppParent";
        static readonly SECTION: "section";
        static readonly DATE_CREATED: "dateCreated";
        static readonly DEPLOYED: "deployed";
    }
}
