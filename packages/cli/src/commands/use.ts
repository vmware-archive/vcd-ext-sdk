import Command, { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';

export default class Use extends Command {

    static description = 'Switch to previously configured session';

    static examples = [
        `$ vcd-ext use <alias>
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [
        { name: 'alias', description: 'Alias for the session token to switch to' }
    ];
    type = 'use';

    async run() {
        const { args } = this.parse(Use);
        CloudDirectorConfig
            .fromDefault()
            .use(args.alias);
    }
}
