import Command, { flags } from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import * as inquirer from 'inquirer';

export default class Login extends Command {

    static description = 'Logs into Cloud Director and stores the session';

    static examples = [
        `$ vcd-ext login <alias> <basePath> <username> <password>
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
        ci: flags.boolean({ description: 'Indicates the command is run within CI environment. It skips analytics consent prompt.'})
    };

    static args = [
        { name: 'alias', required: true, description: 'Alias for stroing the session token' },
        { name: 'basePath', required: true, description: 'Cloud director URL https://<host>[:<port>]/cloudapi' },
        {
            name: 'username',
            required: true,
            description: 'Username in the form of <user>[@<tenant>]. If @<tenant> is omitted System tenant will be used.'
        },
        { name: 'password', description: 'Password for the user'}
    ];

    async run() {
        const { args } = this.parse(Login);
        const user = args.username.split('@')[0];
        const org = args.username.split('@')[1] || 'System';
        let password = args.password;
        if (!password) {
            const answers = await inquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Password: ',
            });
            password = answers.password;
        }
        const config = await CloudDirectorConfig.withUsernameAndPassword(
            args.basePath,
            user,
            org,
            password
        );
        if (!config.connectionAuth.authorized) {
            console.warn('Connection error: ' + config.connectionAuth.authorizationError);
            console.log(config.connectionAuth.certificate);
            const answers = await inquirer.prompt({
                type: 'confirm',
                name: 'accept',
                message: 'Do you accept the provided certificate?',
            });
            config.connectionAuth.authorized = answers.accept;
        }
        config.saveConfig(args.alias);
    }
}
