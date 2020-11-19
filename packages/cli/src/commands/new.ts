import { flags } from '@oclif/command';
import ScaffoldingBaseCommand from '../ScaffoldingBaseCommand';

export default class New extends ScaffoldingBaseCommand {

    static description = 'Creates a new project in the folder provided as a name';

    static examples = [
        `$ vcd-ext new ticketing
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [{ name: 'name', description: 'Project name' }];
    type = 'new';

    async run() {
        const { args } = this.parse(New);

        await super.generate(this.type, {
            type: this.type,
            name: args.name
        });
    }
}
