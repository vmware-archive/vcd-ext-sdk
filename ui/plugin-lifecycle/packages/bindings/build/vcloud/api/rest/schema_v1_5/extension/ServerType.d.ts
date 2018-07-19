import { EntityType } from "./../EntityType";
export declare class ServerType extends EntityType {
    username?: string;
    password?: string;
    url?: string;
}
export declare namespace ServerType {
    class Fields extends EntityType.Fields {
        static readonly USERNAME: "username";
        static readonly PASSWORD: "password";
        static readonly URL: "url";
    }
}
