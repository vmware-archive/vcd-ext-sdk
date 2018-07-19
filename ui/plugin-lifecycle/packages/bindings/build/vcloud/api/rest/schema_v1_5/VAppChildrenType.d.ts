import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { VmType } from "./VmType";
import { VAppType } from "./VAppType";
export declare class VAppChildrenType extends VCloudExtensibleType {
    vApp?: VAppType[];
    vm?: VmType[];
}
export declare namespace VAppChildrenType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly V_APP: "vApp";
        static readonly VM: "vm";
    }
}
