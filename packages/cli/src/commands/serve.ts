import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

import Command, { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import { CarePackage, ElementType } from '../care';

const DEFAULT_ENV_CONTENT = {
    production: false,
    branding: {
        headerTitle: 'VMware Cloud Director'
    }
};

const DEFAULT_PROXY_CONTENT = {
    '/api/*': {
        target: 'https://<insert your VCD endpoint here>',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true
    },
    '/cloudapi/*': {
        target: 'https://<insert your VCD endpoint here>',
        secure: false,
        logLevel: 'debug',
        changeOrigin: true
    }
};
export default class Serve extends Command {

    static description = 'Serves an emulated environmnet';

    static examples = [
        `$ vcd-ext serve
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [];
    type = 'serve';

    private loadJsonConfig(rootDir: string, name: string) {
        const jsonPath = path.resolve(rootDir, name);
        if (!fs.existsSync(jsonPath)) {
            return null;
        }
        const fileContent = fs.readFileSync(jsonPath).toString();
        return JSON.parse(fileContent);
    }

    private storeJsonConfig(rootDir: string, name: string, content: any) {
        const jsonPath = path.resolve(rootDir, name);
        fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));
    }

    async run() {
        const carePackage = CarePackage.loadFromSource();
        const currentElement = carePackage.getElementAt(process.cwd());
        if (!currentElement || currentElement.type !== ElementType.uiPlugin) {
            throw new Error('Serve command can be triggred only in the context of \'uiPlugin\' subcomponent');
        }

        const rootDir = path.join(process.cwd(), '.env'); // Extract as optional parameter?
        const environmnet = this.loadJsonConfig(rootDir, 'environment.json') || DEFAULT_ENV_CONTENT;
        const proxyConfig = this.loadJsonConfig(rootDir, 'proxy.conf.json') || DEFAULT_PROXY_CONTENT;
        try {
            const config = CloudDirectorConfig.fromDefault();
            environmnet.credentials = {
                token: `Bearer ${config.token}`
            };
            Object.keys(proxyConfig).forEach(key => {
                proxyConfig[key].target = new URL(config.basePath).origin;
            });
        } catch (e) {
            this.log('Error configuring environment.', e);
        } finally {
            this.storeJsonConfig(rootDir, 'environment.runtime.json', environmnet);
            this.storeJsonConfig(rootDir, 'proxy.conf.runtime.json', proxyConfig);
        }
        spawn('npm', ['run', 'ng:serve'], { stdio: 'inherit' });
    }
}
