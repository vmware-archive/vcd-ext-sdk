import Command, { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import { CarePackage } from '@vcd/care-package';

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
        }),
        ci: flags.boolean({ description: 'Indicates the command is run within CI environment. It skips analytics consent prompt.'})
    };

    static args = [{ name: 'name', required: false }];
    type = 'deploy';

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags, args } = this.parse(Deploy);
        const config = CloudDirectorConfig.fromDefault();
        const carePackage = args.name ?
            await CarePackage.loadFromPackage(args.name) :
            await CarePackage.loadFromSource();
        return carePackage.deploy(flags.only, { config, force: flags.force });
    }
}
