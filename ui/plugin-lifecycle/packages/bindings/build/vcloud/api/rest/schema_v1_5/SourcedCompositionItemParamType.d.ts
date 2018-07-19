import { VmGeneralParamsType } from "./VmGeneralParamsType";
import { NetworkAssignmentType } from "./NetworkAssignmentType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LocalityParamsType } from "./LocalityParamsType";
import { InstantiationParamsType } from "./InstantiationParamsType";
import { ReferenceType } from "./ReferenceType";
import { VmCapabilitiesType } from "./VmCapabilitiesType";
export declare class SourcedCompositionItemParamType extends VCloudExtensibleType {
    source?: ReferenceType;
    vmGeneralParams?: VmGeneralParamsType;
    vAppScopedLocalId?: string;
    instantiationParams?: InstantiationParamsType;
    networkAssignment?: NetworkAssignmentType[];
    storageProfile?: ReferenceType;
    localityParams?: LocalityParamsType;
    vmCapabilities?: VmCapabilitiesType;
    sourceDelete?: boolean;
}
export declare namespace SourcedCompositionItemParamType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SOURCE: "source";
        static readonly VM_GENERAL_PARAMS: "vmGeneralParams";
        static readonly V_APP_SCOPED_LOCAL_ID: "vAppScopedLocalId";
        static readonly INSTANTIATION_PARAMS: "instantiationParams";
        static readonly NETWORK_ASSIGNMENT: "networkAssignment";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly LOCALITY_PARAMS: "localityParams";
        static readonly VM_CAPABILITIES: "vmCapabilities";
        static readonly SOURCE_DELETE: "sourceDelete";
    }
}
