import Command, { flags } from '@oclif/command'
import { CloudDirectorConfig } from '@vcd/node-client'
import { Deployer } from '../deployer';

export default class Deploy extends Command {
    type: string = 'deploy';

    static description = 'Deploys extensibility entities to previously logged in vCD instance'

    static examples = [
        `$ vcd-ext deploy
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        force: flags.boolean({ char: 'f', default: false }),
    }

    static args = []

    async run() {
        const { flags } = this.parse(Deploy)
        try {
            const apiConfig = CloudDirectorConfig.fromDefault()
            this.debug(`Creating from default config ${apiConfig}`)
            return new Deployer(apiConfig, flags.force, this.debug).deploy()
        } catch (e) {
            this.debug('Error deploying', e)
            throw e
        } 
    }
}
