import { MsgType } from "./MsgType";
export declare class Network {
    description?: MsgType;
    name?: string;
    otherAttributes?: object;
}
export declare namespace Network {
    class Fields {
        static readonly DESCRIPTION: "description";
        static readonly NAME: "name";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
