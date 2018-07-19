import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ParamsType extends VCloudExtensibleType {
    description?: string;
    name?: string;
}
export declare namespace ParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly NAME: "name";
    }
}
