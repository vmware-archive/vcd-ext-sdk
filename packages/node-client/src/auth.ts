import * as api from './api';

export class CloudDirectorDefaultHeaders implements api.Authentication {

    applyToRequest(requestOptions: any): void {
        requestOptions.headers['Accept'] = 'application/json;version=35.0'
        requestOptions.strictSSL = false
    }
}

export class BasicAuth extends CloudDirectorDefaultHeaders {
    constructor(
        public username: string,
        public org: string,
        public password: string
    ) { 
        super()
    }

    applyToRequest(requestOptions: any): void {
        super.applyToRequest(requestOptions)
        const authString = `${this.username}@${this.org}:${this.password}`;
        requestOptions.headers["Authorization"] = `Basic ${Buffer.from(authString).toString('base64')}`;
    }
}

export class CloudDirectorAuthentication extends CloudDirectorDefaultHeaders {
    constructor(
        public username: string,
        public org: string,
        public authorizationKey: string
    ) { 
        super()
    }

    applyToRequest(requestOptions: any): void {
        super.applyToRequest(requestOptions)
        requestOptions.headers["Authorization"] = `Bearer ${this.authorizationKey}`;
    }
}