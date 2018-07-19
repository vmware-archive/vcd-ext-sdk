import { CimBoolean } from "./CimBoolean";
export declare class QualifierBoolean extends CimBoolean {
    qualifier?: boolean;
}
export declare namespace QualifierBoolean {
    class Fields extends CimBoolean.Fields {
        static readonly QUALIFIER: "qualifier";
    }
}
