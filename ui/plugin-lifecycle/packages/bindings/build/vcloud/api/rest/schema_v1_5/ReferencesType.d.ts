import { ContainerType } from "./ContainerType";
import { ReferenceType } from "./ReferenceType";
export declare class ReferencesType extends ContainerType {
    reference?: ReferenceType[];
}
export declare namespace ReferencesType {
    class Fields extends ContainerType.Fields {
        static readonly REFERENCE: "reference";
    }
}
