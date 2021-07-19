import { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import * as inquirer from 'inquirer';
import CloudDirectorConfigBaseCommand from '../CloudDirectorConfigBaseCommand';

export default class Use extends CloudDirectorConfigBaseCommand {

    static description = 'Switch to previously configured session';

    static examples = [
        `$ vcd-ext use <alias>
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [
        { name: 'alias', required: false, description: 'Alias for the session token to switch to' }
    ];
    type = 'use';

    async run() {
        const { args } = this.parse(Use);
        const alias = args.alias;
        if (alias) {
            CloudDirectorConfig.use(alias);
        } else {
            const configs = CloudDirectorConfig.getConfigurations();
            const answers = await inquirer.prompt({
                type: 'list',
                name: 'alias',
                message: 'Select configuration',
                default: configs.current,
                loop: false,
                choices: configs.configurations.map((element) => {
                    return {
                        name: `${element.key}: ${element.username}/${element.org} ${element.basePath}`,
                        value: element.key
                    };
                }),
            });
            CloudDirectorConfig.use(answers.alias);
        }
        await this.getCloudDirectorConfig();
    }
}
