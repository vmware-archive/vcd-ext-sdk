import { CimLong } from "./CimLong";
export declare class QualifierSInt64 extends CimLong {
    qualifier?: boolean;
}
export declare namespace QualifierSInt64 {
    class Fields extends CimLong.Fields {
        static readonly QUALIFIER: "qualifier";
    }
}
