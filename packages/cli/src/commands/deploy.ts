import { flags } from '@oclif/command';
import { CarePackage } from '@vcd/care-package';
import CloudDirectorConfigBaseCommand from '../CloudDirectorConfigBaseCommand';

export default class Deploy extends CloudDirectorConfigBaseCommand {

    static description = `Deploys extensibility entities to previously logged in vCD instance.
    If a file is provided it deploys from the file, otherwise it needs to be run in the context of a solution projects.`;

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
            description: 'Comma separated list of sub-component names to be deployed. If not provided it deploys all sub-components.'
        }),
        ci: flags.boolean({ description: 'Indicates the command is run within CI environment. It skips analytics consent prompt.'})
    };

    static args = [{ name: 'name', required: false }];
    type = 'deploy';

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags, args } = this.parse(Deploy);
        const config = await this.getCloudDirectorConfig();

        const carePackage = args.name ?
            await CarePackage.loadFromPackage(args.name) :
            await CarePackage.loadFromSource();
        return carePackage.deploy(flags.only, config, { force: flags.force });
    }
}
