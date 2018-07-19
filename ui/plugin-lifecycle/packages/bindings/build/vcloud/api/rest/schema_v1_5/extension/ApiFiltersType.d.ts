import { ApiFilterType } from "./ApiFilterType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class ApiFiltersType extends VCloudExtensibleType {
    apiFilter?: ApiFilterType[];
}
export declare namespace ApiFiltersType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly API_FILTER: "apiFilter";
    }
}
