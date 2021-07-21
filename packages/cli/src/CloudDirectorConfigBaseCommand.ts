import Command from '@oclif/command';
import { CloudDirectorConfig } from '@vcd/node-client';
import * as inquirer from 'inquirer';

export default abstract class CloudDirectorConfigBaseCommand extends Command {

    async getCloudDirectorConfig(): Promise<CloudDirectorConfig> {
        let config = CloudDirectorConfig.fromDefault();
        if (!config.connectionAuth.authorized && config.connectionAuth.authorizationError === 'Token expired') {
            const answers = await inquirer.prompt({
                type: 'password',
                name: 'password',
                message:
                `Token has expired. Please enter the password for ${config.authentication.username}@${config.authentication.org} again: `,
            });
            const password = answers.password;
            config = await this.loginAndStore(
                CloudDirectorConfig.getConfigurations().current,
                config.basePath, config.authentication.username, config.authentication.org, password);
        }
        return config;
    }

    async loginAndStore(alias: string, basePath: string, user: string, org: string, password: string) {
        const config = await CloudDirectorConfig.withUsernameAndPassword(
            basePath,
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
        config.saveConfig(alias);
        return config;
    }
}
