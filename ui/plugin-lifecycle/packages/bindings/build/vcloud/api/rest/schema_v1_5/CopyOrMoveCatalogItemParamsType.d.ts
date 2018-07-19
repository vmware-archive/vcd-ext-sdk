import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class CopyOrMoveCatalogItemParamsType extends ParamsType {
    source?: ReferenceType;
}
export declare namespace CopyOrMoveCatalogItemParamsType {
    class Fields extends ParamsType.Fields {
        static readonly SOURCE: "source";
    }
}
