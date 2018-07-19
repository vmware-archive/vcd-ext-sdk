import { VAppTemplateType } from "./VAppTemplateType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class VAppTemplateChildrenType extends VCloudExtensibleType {
    vm?: VAppTemplateType[];
}
export declare namespace VAppTemplateChildrenType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VM: "vm";
    }
}
