import { FileUploadParamsType } from "./../FileUploadParamsType";
export declare class VcTrustStoreUpdateParamsType extends FileUploadParamsType {
    password?: string;
    type?: string;
}
export declare namespace VcTrustStoreUpdateParamsType {
    class Fields extends FileUploadParamsType.Fields {
        static readonly PASSWORD: "password";
        static readonly TYPE: "type";
    }
}
