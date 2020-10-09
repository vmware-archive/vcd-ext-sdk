import * as fs from 'fs';
import * as https from 'https';
import * as debug from 'debug';
import { URL } from 'url';

const log = debug('vcd:api-client:transfer')

export class TransferClient {
    constructor(private url: string, private authorizationKey: string) {
    }

    public async upload(filePath: string, contentType: string) {

        const urlObj = new URL(this.url)

        const options: https.RequestOptions = {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: "PUT",
            headers: {
                'Content-Type': contentType,
                Authorization: `Bearer ${this.authorizationKey}`
            }
        }
        log('Sending request with options: ', options)
        return new Promise<any>((resolve, reject) => {
            const req = https.request(options, (res) => {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    log(`recieved http error response: ${res}`)
                    reject({ res, body: null });
                }
                const chunks = [];
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                res.on('end', () => {
                    const body = Buffer.concat(chunks);
                    log(`recieved response: ${body.toString()}`)
                    resolve({ res, body })
                });
            });
            req.on('error', (e) => {
                log(`problem with request: ${e.message}`);
                reject(e)
            });
            const data = fs.createReadStream(filePath);
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        })
    }
}