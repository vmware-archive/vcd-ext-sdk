import { RightType } from "./../RightType";
export declare class UpdateRightsParamsType {
    addRight?: RightType[];
    removeRight?: string[];
}
export declare namespace UpdateRightsParamsType {
    class Fields {
        static readonly ADD_RIGHT: "addRight";
        static readonly REMOVE_RIGHT: "removeRight";
    }
}
