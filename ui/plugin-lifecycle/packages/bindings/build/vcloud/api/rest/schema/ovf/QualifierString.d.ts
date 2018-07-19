import { CimString } from "./CimString";
export declare class QualifierString extends CimString {
    qualifier?: boolean;
}
export declare namespace QualifierString {
    class Fields extends CimString.Fields {
        static readonly QUALIFIER: "qualifier";
    }
}
