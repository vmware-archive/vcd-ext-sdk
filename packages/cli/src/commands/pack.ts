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
        }),
      ci: flags.boolean({
        description: 'Indicates the command is run within CI environment. It' +
          ' skips analytics consent prompt.'
      }),
      iso: flags.boolean({
        description: 'Whether the contents should be packaged as an iso. It' +
          ' is optimal to use this in combination with the --executable flag. Otherwise you will' +
          ' need the vcd-ext CLI tool installed locally to deploy the CARE package.',
        default: false
      }),
      executable: flags.string({
        description: 'An absolute path to a single vcd-ext CLI executable' +
          ' file. Used in combination with --iso to create a fully independent care package' +
          ' deployer.'
      })
    };

    static args = [
      { name: 'name', required: false, description: 'Optional archive name' }
    ];

    async run() {
        // tslint:disable-next-line: no-shadowed-variable
        const { flags, args } = this.parse(Pack);

        const carePackage = await CarePackage.loadFromSource();
        return carePackage.pack(flags, { name: args.name });
    }
}
