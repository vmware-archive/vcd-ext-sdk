import { CimUnsignedInt } from "./CimUnsignedInt";
export declare class QualifierUInt32 extends CimUnsignedInt {
    qualifier?: boolean;
}
export declare namespace QualifierUInt32 {
    class Fields extends CimUnsignedInt.Fields {
        static readonly QUALIFIER: "qualifier";
    }
}
