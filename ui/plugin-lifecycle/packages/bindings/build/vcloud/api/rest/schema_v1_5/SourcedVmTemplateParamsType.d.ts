import { VmGeneralParamsType } from "./VmGeneralParamsType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LocalityParamsType } from "./LocalityParamsType";
import { InstantiationParamsType } from "./InstantiationParamsType";
import { ReferenceType } from "./ReferenceType";
import { VmCapabilitiesType } from "./VmCapabilitiesType";
export declare class SourcedVmTemplateParamsType extends VCloudExtensibleType {
    source?: ReferenceType;
    vmGeneralParams?: VmGeneralParamsType;
    vmTemplateInstantiationParams?: InstantiationParamsType;
    storageProfile?: ReferenceType;
    localityParams?: LocalityParamsType;
    vmCapabilities?: VmCapabilitiesType;
}
export declare namespace SourcedVmTemplateParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SOURCE: "source";
        static readonly VM_GENERAL_PARAMS: "vmGeneralParams";
        static readonly VM_TEMPLATE_INSTANTIATION_PARAMS: "vmTemplateInstantiationParams";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly LOCALITY_PARAMS: "localityParams";
        static readonly VM_CAPABILITIES: "vmCapabilities";
    }
}
