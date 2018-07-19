import { ServerType } from "./ServerType";
import { ReferenceType } from "./../ReferenceType";
export declare class ShieldManagerType extends ServerType {
    associatedVimServer?: ReferenceType;
    controlVmResourcePoolName?: string;
    controlVmDatastoreName?: string;
    controlVmManagementInterfaceName?: string;
}
export declare namespace ShieldManagerType {
    class Fields extends ServerType.Fields {
        static readonly ASSOCIATED_VIM_SERVER: "associatedVimServer";
        static readonly CONTROL_VM_RESOURCE_POOL_NAME: "controlVmResourcePoolName";
        static readonly CONTROL_VM_DATASTORE_NAME: "controlVmDatastoreName";
        static readonly CONTROL_VM_MANAGEMENT_INTERFACE_NAME: "controlVmManagementInterfaceName";
    }
}
