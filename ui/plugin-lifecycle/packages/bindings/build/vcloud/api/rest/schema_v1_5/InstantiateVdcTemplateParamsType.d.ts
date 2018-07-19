import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class InstantiateVdcTemplateParamsType extends VCloudExtensibleType {
    source?: ReferenceType;
    description?: string;
    name?: string;
}
export declare namespace InstantiateVdcTemplateParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SOURCE: "source";
        static readonly DESCRIPTION: "description";
        static readonly NAME: "name";
    }
}
