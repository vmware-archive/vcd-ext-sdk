import Command, { flags } from '@oclif/command';
import { ConsentStore } from '../analytics/store';

export default class Analytics extends Command {

    static description = 'Configures the gathering of usage metrics';

    static examples = [
        `$ vcd-ext analytics <on|off|prompt>
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [
        { name: 'setting', required: true, description: `The value of the setting is one of the following:
 * 'on'     - enables analytics gathering and reporting for the current user.
 * 'off'    - disables analytics gathering and reporting for the current user.
 * 'prompt' - Prompts the user to set the status interactively.`
        }
    ];

    async run() {
        const { args } = this.parse(Analytics);
        const setting = args.setting;
        const store = new ConsentStore();

        if (setting !== 'prompt') {
            store.storeConset(setting === 'on');
            return Promise.resolve();
        }
        return store.promptAndStore();
    }
}
