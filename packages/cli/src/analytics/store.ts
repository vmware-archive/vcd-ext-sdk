/*
Responsible for managing user consent
 */
import * as fs from 'fs';
import * as path from 'path';
import * as debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import * as inquirer from 'inquirer';

const log = debug('vcd-ext:analytics');

/**
 * Where user consent is persisted
 */
const DEFAULT_CONFIG_LOCATION = path.join(findHomeDir(), '.vcd', 'analytics');

/**
 * Returns OS independent home directory
 */
function findHomeDir(): string {
    if (process.env.HOME) {
        try {
            fs.accessSync(process.env.HOME);
            return process.env.HOME;
            // tslint:disable-next-line:no-empty
        } catch (ignore) { }
    }
    if (process.platform !== 'win32') {
        return '';
    }
    if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
        const dir = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH);
        try {
            fs.accessSync(dir);
            return dir;
            // tslint:disable-next-line:no-empty
        } catch (ignore) { }
    }
    if (process.env.USERPROFILE) {
        try {
            fs.accessSync(process.env.USERPROFILE);
            return process.env.USERPROFILE;
            // tslint:disable-next-line:no-empty
        } catch (ignore) { }
    }
    return '';
}

/**
 * Loads previously stored user consent
 */
const loadConfig = () => {
    if (fs.existsSync(DEFAULT_CONFIG_LOCATION)) {
        const fileContent = fs.readFileSync(DEFAULT_CONFIG_LOCATION).toString();
        const config = JSON.parse(fileContent);
        return config;
    }
    return null;
};

/**
 * Creates or Updates previously user consent
 * @param config - contains user consent
 */
const updateConfig = (config: any) => {
    const dirName = path.dirname(DEFAULT_CONFIG_LOCATION);
    if (!fs.existsSync(dirName)) {
        log(`Config location doesn't exists. Creating: ${dirName}`);
        fs.mkdirSync(dirName);
    }
    fs.writeFileSync(DEFAULT_CONFIG_LOCATION, JSON.stringify(config));
};

/**
 * Provides user consent operations
 */
export class ConsentStore {

    config: any;

    constructor() {
        this.config = loadConfig();
    }

    isConsentAsked(): boolean {
        if (this.config && this.config.agreed !== undefined) {
            return true;
        }
        return false;
    }

    isCIRun(): boolean {
        if (process.env.ENABLE_VCD_SDK_CLI_ANALYTICS && process.env.ENABLE_VCD_SDK_CLI_ANALYTICS === 'true') {
            return true;
        }
        return false;
    }

    hasConsent(): boolean {
        if (this.isCIRun()) {
            return true;
        }
        if (this.config && this.config.agreed !== undefined) {
            return this.config.agreed;
        }
        return false;
    }

    async promptAndStore() {
        const answers = await inquirer.prompt({
            type: 'confirm',
            name: 'agreed',
            default: true,
            message: 'VMware\'s Customer Experience Improvement Program ("CEIP") provides VMware with information ' +
            'that enables VMware to improve its products and services, to fix problems, and to advise you ' +
            'on how best to deploy and use our products. As part of the CEIP, VMware collects technical ' +
            'information about your organization\'s use of VMware products and services on a regular basis. ' +
            'This information does not personally identify any individual. ' +
            '\nAdditional information regarding the data collected through CEIP and the purposes for which it ' +
            'is used by VMware is set forth in the Trust & Assurance Center at http://www.vmware.com/trustvmware/ceip.html. ' +
            'If you prefer not to participate in VMware\'s CEIP for this product, you should use vcd-ext analytics command to opt out. ' +
            '\nYou may join or leave VMware\'s CEIP for this product at any time.\n'
        });
        this.storeConset(answers.agreed);
    }

    storeConset(agreed: boolean) {
        if (!this.config) {
            this.config = {
                instanceId: uuidv4()
            };
        }
        updateConfig({
            ...this.config,
            agreed
        });
    }
    getInstanceId() {
        return this.config.instanceId;
    }
}
