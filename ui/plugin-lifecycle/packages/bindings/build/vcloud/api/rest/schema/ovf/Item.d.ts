export declare class Item {
    id?: string;
    order?: number;
    startAction?: string;
    startDelay?: number;
    stopAction?: string;
    stopDelay?: number;
    waitingForGuest?: boolean;
    otherAttributes?: object;
}
export declare namespace Item {
    class Fields {
        static readonly ID: "id";
        static readonly ORDER: "order";
        static readonly START_ACTION: "startAction";
        static readonly START_DELAY: "startDelay";
        static readonly STOP_ACTION: "stopAction";
        static readonly STOP_DELAY: "stopDelay";
        static readonly WAITING_FOR_GUEST: "waitingForGuest";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
