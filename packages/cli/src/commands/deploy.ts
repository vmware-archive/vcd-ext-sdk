import * as os from 'os';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as AdmZip from 'adm-zip';
import * as uuid from 'uuid';

import Command, { flags } from '@oclif/command'
import { CloudDirectorConfig } from '@vcd/node-client'
import { Deployer } from '../deployer';
import { CarePackage, CarePackageSource } from '../care';

export default class Deploy extends Command {
    type: string = 'deploy';

    static description = 'Deploys extensibility entities to previously logged in vCD instance'

    static examples = [
        `$ vcd-ext deploy`,
        `$ vcd-ext deploy mysolution.care`
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        force: flags.boolean({ char: 'f', default: false }),
    }

    static args = [{ name: 'name', required: false }]

    async run() {
        const { flags, args } = this.parse(Deploy)
        let carePackage: any = null;
        let isUnzipped = false;
        if (args.name) {
            this.debug(`Deploying from package: ${args.name}`)
            const zip = new AdmZip(args.name);
            const packageRoot = path.join(os.tmpdir(), uuid.v4())
            zip.extractAllTo(packageRoot, true)
            isUnzipped = true
            carePackage = CarePackage.loadFromPackage(packageRoot, 'manifest.json')
        } else {
            carePackage = CarePackage.loadFromSource()
        }
        this.debug(`Loaded CARE package root: ${carePackage.packageRoot}`)
        this.debug(`Elements: ${JSON.stringify(carePackage.elements, null, 2)}`)
        try {
            const apiConfig = CloudDirectorConfig.fromDefault()
            this.debug(`Creating from default config ${apiConfig}`)
            return new Deployer(apiConfig, flags.force).deploy(carePackage)
        } catch (e) {
            this.debug('Error deploying', e)
            throw e
        } finally {
            // if (isUnzipped) {
            //     rimraf(carePackage.packageRoot, (e) => 
            //         this.debug(`Finished removing tmp folder ${carePackage.packageRoot}`, e))
            // }
        }
    }
}
