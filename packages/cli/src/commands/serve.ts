import Command, { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import { CarePackage } from '@vcd/care-package';

export default class Serve extends Command {

    static description = 'Serves an emulated environmnet';

    static examples = [
        `$ vcd-ext serve
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
        only: flags.string({
            required: false,
            default: '',
            description: 'Comma separated list of element names to be deployed. If not provided it deployes all elements.'
        })
    };

    static args = [];
    type = 'serve';

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags } = this.parse(Serve);
        const config = CloudDirectorConfig.fromDefault();
        const carePackage = await CarePackage.loadFromSource();
        return carePackage.serve(flags.only, { config });
    }
}
