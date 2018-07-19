import { FileUploadParamsType } from "./FileUploadParamsType";
export declare class SspiKeytabUpdateParamsType extends FileUploadParamsType {
    sspiServiceProviderName?: string;
}
export declare namespace SspiKeytabUpdateParamsType {
    class Fields extends FileUploadParamsType.Fields {
        static readonly SSPI_SERVICE_PROVIDER_NAME: "sspiServiceProviderName";
    }
}
