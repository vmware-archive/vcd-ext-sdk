import { FileUploadParamsType } from "./FileUploadParamsType";
export declare class TrustStoreUpdateParamsType extends FileUploadParamsType {
    password?: string;
}
export declare namespace TrustStoreUpdateParamsType {
    class Fields extends FileUploadParamsType.Fields {
        static readonly PASSWORD: "password";
    }
}
