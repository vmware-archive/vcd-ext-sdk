import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class MksTicketType extends VCloudExtensibleType {
    host?: string;
    vmx?: string;
    ticket?: string;
    port?: number;
}
export declare namespace MksTicketType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly HOST: "host";
        static readonly VMX: "vmx";
        static readonly TICKET: "ticket";
        static readonly PORT: "port";
    }
}
