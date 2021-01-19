import * as https from 'https';
import * as debug from 'debug';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { HookKeyOrOptions } from '@oclif/config/lib/hooks';
import { ConsentStore } from './store';
import * as telemetryEndpoint from './telemetry.json';
import { CLIAnalyticsEvent, EventType } from './payload';
const pjson = require('../../package.json');

const log = debug('vcd-ext:analytics');


export class AnalyticsCollector {
    static store = new ConsentStore();
    static cliRunId = uuidv4();

    static async send(eventType: EventType, options?: HookKeyOrOptions<'prerun'> | HookKeyOrOptions<'postrun'>, error?: Error) {
        if (!this.store.hasConsent()) {
            return;
        }
        // tslint:disable-next-line: max-line-length
        const endpoint = `https://${telemetryEndpoint.host}.vmware.com/sc/api/collectors/${telemetryEndpoint.collectorId}/batch`;
        const urlObj = new URL(endpoint);
        // System properties
        const payload = new CLIAnalyticsEvent(
            `urn:vcloud:ext:sdk:cli:${this.store.getInstanceId()}`,
            this.cliRunId,
            eventType,
            {
                command: options ? options.Command.id : undefined,
                errorCode: error ? error.message : undefined,
                os: process.platform,
                nodeVersion: process.version,
                cliVersion: pjson.version,
                isCIRun: this.store.isCIRun()
            }
        );

        const postData = JSON.stringify(payload);

        const requestOptions: https.RequestOptions = {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        log(`Analytics payload:
${postData}`);
        return new Promise<void>((resolve) => {
            const req = https.request(requestOptions, log);
            req.on('error', log);
            req.on('close', resolve);
            req.write(postData);
            req.end();
        });
    }
}
