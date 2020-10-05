import * as fs from "fs";
import * as path from "path";
import { spawn } from 'child_process';

import Command, { flags } from '@oclif/command'
import { CloudDirectorConfig } from '@vcd/node-client'

const DEFAULT_ENV_CONTENT = {
    "production": false,
    "branding": {
        "headerTitle": "VMware Cloud Director"
    }
}

const DEFAULT_PROXY_CONTENT = {
    "/api/*": {
        "target": "https://<insert your VCD endpoint here>",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/cloudapi/*": {
        "target": "https://<insert your VCD endpoint here>",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
    }
}
export default class Serve extends Command {
    type: string = 'serve';

    static description = 'Serves an emulated environmnet'

    static examples = [
        `$ vcd-ext serve
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
    }

    static args = []

    private loadJsonConfig(rootDir: string, name: string) {
        let jsonPath = path.resolve(rootDir, name);
        if (!fs.existsSync(jsonPath)) {
            return null
        }
        let fileContent = fs.readFileSync(jsonPath).toString();
        return JSON.parse(fileContent);
    }

    private storeJsonConfig(rootDir: string, name: string, content: any) {
        let jsonPath = path.resolve(rootDir, name);
        fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));
    }

    async run() {
        const rootDir = path.join(process.cwd(), ".env"); //Extract as optional parameter?
        try {
            const config = CloudDirectorConfig.fromDefault()
            const environmnet = this.loadJsonConfig(rootDir, "environment.json") || DEFAULT_ENV_CONTENT
            environmnet.credentials = {
                token: config.token
            }
            this.storeJsonConfig(rootDir, "environment.runtime.json", environmnet)
            const proxyConfig = this.loadJsonConfig(rootDir, "proxy.conf.json") || DEFAULT_PROXY_CONTENT
            Object.keys(proxyConfig).forEach(key => {
                proxyConfig[key].target = new URL(config.basePath).origin
            })
            this.storeJsonConfig(rootDir, "proxy.conf.runtime.json", proxyConfig)    
        } catch (e) {
            this.log("Error configuring environment.", e)
        }
        spawn('npm', ['run', 'ng:serve'], { stdio: "inherit" })
    }
}
