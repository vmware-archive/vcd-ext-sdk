import { v4 as uuidv4 } from 'uuid';

export interface CloudEvent {
    specversion: string;
    datacontenttype?: string;
    dataschema?: string;
    type: string;
    source: string;
    subject?: string;
    id: string;
    time?: string;
    data?: any;
}

export interface SuperColliderEvent extends CloudEvent {
    '@table': string;
}

export interface CLIAnalyticsPayload {
    command?: string;
    errorCode?: string;
    os: string;
    nodeVersion: string;
    cliVersion: string;
    isCIRun?: boolean;
}

export enum EventType {
    PRERUN = 'CLI_COMMAND_PRERUN',
    SUCCESS = 'CLI_COMMAND_SUCCESS',
    FAILED = 'CLI_COMMAND_FAILED'
}

export class CLIAnalyticsEvent implements SuperColliderEvent {
    '@table' = 'vcd_ext_cli';
    specversion = '1.0';
    id: string;
    time: string;

    constructor(
        public source: string,
        public subject: string,
        public type: EventType,
        public data: CLIAnalyticsPayload
    ) {
        this.id = uuidv4();
        this.time = new Date().toISOString();
    }
}
