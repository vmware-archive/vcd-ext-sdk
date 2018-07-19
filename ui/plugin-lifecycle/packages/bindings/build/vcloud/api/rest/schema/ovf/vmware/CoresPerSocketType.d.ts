import { CimUnsignedInt } from "./../CimUnsignedInt";
export declare class CoresPerSocketType extends CimUnsignedInt {
    required?: boolean;
}
export declare namespace CoresPerSocketType {
    class Fields extends CimUnsignedInt.Fields {
        static readonly REQUIRED: "required";
    }
}
