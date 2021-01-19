import Command, { flags } from '@oclif/command';
import { CarePackage } from '@vcd/care-package';

export default class Build extends Command {

    static description = 'builds the elements of a CARE package for which custom build is defined';

    static examples = [
        `$ vcd-ext build
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command' }),
        only: flags.string({
            required: false,
            default: '',
            description: 'Comma separated list of element names to be deployed. If not provided it deployes all elements.'
        }),
        ci: flags.boolean({ description: 'Indicates the command is run within CI environment. It skips analytics consent prompt.'})
    };

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags } = this.parse(Build);
        const carePackage = await CarePackage.loadFromSource();
        return carePackage.build(flags.only);
    }
}
