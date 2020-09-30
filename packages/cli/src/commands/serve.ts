import * as fs from "fs";
import * as path from "path";
import { spawn } from 'child_process';

import Command, { flags } from '@oclif/command'
import { CloudDirectorConfig } from '@vcd/node-client'

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
            throw new Error(`Missing ${jsonPath}`);
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
        const config = CloudDirectorConfig.fromDefault()
        const environmnet = this.loadJsonConfig(rootDir, "environment.json")
        environmnet.credentials = {
            token: config.token
        }
        this.storeJsonConfig(rootDir, "environment.json", environmnet)
        const proxyConfig = this.loadJsonConfig(rootDir, "proxy.conf.json")
        Object.keys(proxyConfig).forEach(key => {
            proxyConfig[key].target = new URL(config.basePath).origin
        })
        this.storeJsonConfig(rootDir, "proxy.conf.json", proxyConfig)
        spawn('npm', ['run', 'ng:serve'], { stdio: "inherit" })
    }
}
