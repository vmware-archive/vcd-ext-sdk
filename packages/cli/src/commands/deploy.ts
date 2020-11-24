import * as os from 'os';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as AdmZip from 'adm-zip';
import * as uuid from 'uuid';

import Command, { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import { Deployer } from '../deployer';
import { CarePackage } from '../care';

export default class Deploy extends Command {

    static description = `Deploys extensibility entities to previously logged in vCD instance.
    If a file is provided it deployes from the file, otherwise it needs to be run in the context of a solution projects.`;

    static examples = [
        `$ vcd-ext deploy`,
        `$ vcd-ext deploy mysolution.care`
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
        force: flags.boolean({
             char: 'f',
             default: false,
             description: 'If provided it will first try to remove all objects if present and recreated them.'
        }),
        only: flags.string({
            required: false,
            default: '',
            description: 'Comma separated list of subcomponent names to be deployed. If not provided it deployes all subcomponents.'
        })
    };

    static args = [{ name: 'name', required: false }];
    type = 'deploy';

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags, args } = this.parse(Deploy);
        let carePackage: any = null;
        let isUnzipped = false;
        if (args.name) {
            this.debug(`Deploying from package: ${args.name}`);
            const zip = new AdmZip(args.name);
            const packageRoot = path.join(os.tmpdir(), uuid.v4());
            zip.extractAllTo(packageRoot, true);
            isUnzipped = true;
            carePackage = CarePackage.loadFromPackage(packageRoot, 'manifest.json');
        } else {
            carePackage = CarePackage.loadFromSource();
        }
        this.debug(`Loaded CARE package root: ${carePackage.packageRoot}`);
        this.debug(`Elements: ${JSON.stringify(carePackage.elements, null, 2)}`);
        const only = flags.only ? flags.only.split(',').map(p => p.trim()) : null;
        try {
            const apiConfig = CloudDirectorConfig.fromDefault();
            this.debug(`Creating from default config ${apiConfig}`);
            return await new Deployer(apiConfig, flags.force, only).deploy(carePackage);
        } catch (e) {
            this.debug('Error deploying', e);
            throw e;
        } finally {
            if (isUnzipped) {
                rimraf(carePackage.packageRoot, (e) =>
                    this.debug(`Finished removing tmp folder ${carePackage.packageRoot}`, e));
            }
        }
    }
}
