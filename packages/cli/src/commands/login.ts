import Command, { flags } from '@oclif/command'
import { CloudDirectorConfig } from '@vcd/node-client'

export default class Login extends Command {
    type: string = 'login';

    static description = 'Logs into Cloud Director and stores the session'

    static examples = [
        `$ vcd-ext login <alias> <basePath> <username> <password>
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
    }

    static args = [
        { name: 'alias' },
        { name: 'basePath'},
        { name: 'username'},
        { name: 'password'}
    ]

    async run() {
        const { args } = this.parse(Login)
        const user = args.username.split("@")[0]
        const org = args.username.split("@")[1] || "System"
        const config = await CloudDirectorConfig.withUsernameAndPassword(
            args.basePath,
            user,
            org,
            args.password
        )
        config.saveConfig(args.alias)
    }
}
