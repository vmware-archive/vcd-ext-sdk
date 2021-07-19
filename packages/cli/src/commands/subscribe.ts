import { flags } from '@oclif/command';
import CloudDirectorConfigBaseCommand from '../CloudDirectorConfigBaseCommand';

export default class Subscribe extends CloudDirectorConfigBaseCommand {

    static description = 'Subscribes to a mqtt topic and starts to listen to messages';

    static examples = [
        `$ vcd-ext subscribe <topic>
`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [
        {
            name: 'topic',
            required: true,
            description: 'Topic to subscribe to in MQTT notation (+ single level wildcard, # multi level wildcard)'
        }
    ];

    async run() {
        const { args } = this.parse(Subscribe);
        const topic = args.topic;
        const config = await this.getCloudDirectorConfig();
        return new Promise((_, reject) => {
            config.makeMQTTClient((client) => {
                console.log(`Subscribing to topic ${topic}`);
                client.on('message', (t, message) => {console.log(`${t}: ${message}`); });
                client.on('error', e => reject(e));
                client.subscribe(topic);
            });
        });
    }
}
