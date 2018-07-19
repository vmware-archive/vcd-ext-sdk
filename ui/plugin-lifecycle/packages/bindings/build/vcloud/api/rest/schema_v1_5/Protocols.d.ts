export declare class Protocols {
    tcp?: boolean;
    udp?: boolean;
    icmp?: boolean;
    any?: boolean;
    other?: string;
}
export declare namespace Protocols {
    class Fields {
        static readonly TCP: "tcp";
        static readonly UDP: "udp";
        static readonly ICMP: "icmp";
        static readonly ANY: "any";
        static readonly OTHER: "other";
    }
}
