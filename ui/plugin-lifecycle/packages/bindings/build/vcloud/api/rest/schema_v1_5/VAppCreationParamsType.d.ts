import { InstantiationParamsType } from "./InstantiationParamsType";
import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class VAppCreationParamsType extends ParamsType {
    vAppParent?: ReferenceType;
    instantiationParams?: InstantiationParamsType;
    deploy?: boolean;
    powerOn?: boolean;
}
export declare namespace VAppCreationParamsType {
    class Fields extends ParamsType.Fields {
        static readonly V_APP_PARENT: "vAppParent";
        static readonly INSTANTIATION_PARAMS: "instantiationParams";
        static readonly DEPLOY: "deploy";
        static readonly POWER_ON: "powerOn";
    }
}
