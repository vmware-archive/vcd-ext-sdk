import { flags } from '@oclif/command';
import { CarePackage } from '@vcd/care-package';
import CloudDirectorConfigBaseCommand from '../CloudDirectorConfigBaseCommand';

export default class Serve extends CloudDirectorConfigBaseCommand {

    static description = 'Serves an emulated environment';

    static examples = [
        `$ vcd-ext serve
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
        only: flags.string({
            required: false,
            default: '',
            description: 'Comma separated list of element names to be served. If not provided it serves all elements.'
        })
    };

    static args = [];
    type = 'serve';

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags } = this.parse(Serve);
        const config = await this.getCloudDirectorConfig();
        const carePackage = await CarePackage.loadFromSource();
        return carePackage.serve(flags.only, config);
    }
}
