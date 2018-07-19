import { FileUploadParamsType } from "./FileUploadParamsType";
export declare class KeystoreUpdateParamsType extends FileUploadParamsType {
    password?: string;
}
export declare namespace KeystoreUpdateParamsType {
    class Fields extends FileUploadParamsType.Fields {
        static readonly PASSWORD: "password";
    }
}
