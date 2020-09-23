import { flags } from '@oclif/command'
import ScaffoldingBaseCommand from '../ScaffoldingBaseCommand'

export default class New extends ScaffoldingBaseCommand {
    type: string = 'new';

    static description = 'create new project'

    static examples = [
        `$ vcd-ext new ticketing
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
    }

    static args = [{ name: 'name' }]

    async run() {
        const { args } = this.parse(New)

        await super.generate(this.type, {
            type: this.type,
            name: args.name
        })
    }
}
