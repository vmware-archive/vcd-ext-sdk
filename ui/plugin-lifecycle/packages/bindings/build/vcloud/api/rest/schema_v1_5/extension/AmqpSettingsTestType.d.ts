import { ResourceType } from "./../ResourceType";
import { ErrorType } from "./../ErrorType";
export declare class AmqpSettingsTestType extends ResourceType {
    valid?: boolean;
    error?: ErrorType;
}
export declare namespace AmqpSettingsTestType {
    class Fields extends ResourceType.Fields {
        static readonly VALID: "valid";
        static readonly ERROR: "error";
    }
}
