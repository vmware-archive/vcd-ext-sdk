import Command, { flags } from '@oclif/command'
import { Compiler } from '@vcd/ext-compiler';
import { CarePackage, ElementType } from '../care';

export default class Build extends Command {
    type: string = 'build';

    static description = 'compile the project from TS to JSON'

    static examples = [
        `$ vcd-ext build
`,
    ]

    static flags = {
        help: flags.help({ char: 'h', description: "Provides usage for the current command" }),
        additionalProperties: flags.boolean({ required: false, description: "Controls whether or not additionalProperties will be allowed or not." })
    }

    async run() {
        const carePackage = CarePackage.loadFromSource()
        const currentElement = carePackage.getElementAt(process.cwd())
        if (!currentElement || currentElement.type !== ElementType.types) {
            throw new Error("Build command can be triggred only in the context of 'types' subcomponent")
        }
        const { argv, flags } = this.parse(Build)
        new Compiler(argv, flags).compile();
    }
}
