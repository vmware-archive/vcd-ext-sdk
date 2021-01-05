import Command, { flags } from '@oclif/command';
import { CarePackage } from '@vcd/care-package';

export default class Pack extends Command {

    static description = `Packages the contents of the solution project into a CARE package.
    File name can be provided as optional parameter.`;

    static examples = [
        `$ vcd-ext pack`,
        `$ vcd-ext pack mypackagename.zip`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
        only: flags.string({
            required: false,
            default: '',
            description: 'Comma separated list of element names to be packed. If not provided it packs all elements.'
        })
    };

    static args = [{ name: 'name', required: false, description: 'Optional archive name' }];

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags, args } = this.parse(Pack);

        const carePackage = await CarePackage.loadFromSource();
        return carePackage.pack(flags.only, { name: args.name });
    }
}
