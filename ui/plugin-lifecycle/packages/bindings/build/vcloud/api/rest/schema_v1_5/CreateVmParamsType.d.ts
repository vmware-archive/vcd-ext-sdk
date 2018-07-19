import { VmType } from "./VmType";
import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class CreateVmParamsType extends ParamsType {
    createVm?: VmType;
    media?: ReferenceType;
    powerOn?: boolean;
}
export declare namespace CreateVmParamsType {
    class Fields extends ParamsType.Fields {
        static readonly CREATE_VM: "createVm";
        static readonly MEDIA: "media";
        static readonly POWER_ON: "powerOn";
    }
}
