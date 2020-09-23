import Command, { flags } from '@oclif/command'
import { Compiler } from '@vcd/ext-compiler';

export default class Build extends Command {
    type: string = 'build';

    static description = 'compile the project from TS to JSON'

    static examples = [
        `$ vcd-ext build
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
    }

    async run() {
        const { argv, flags } = this.parse(Build)
        new Compiler(argv, flags).compile();
    }
}
