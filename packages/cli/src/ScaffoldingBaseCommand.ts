import Command from '@oclif/command';
import { createEnv } from 'yeoman-environment';

export default abstract class ScaffoldingBaseCommand extends Command {

  /**
   * Setups the yeoman generator environment
   */
    protected async generate(type: string, generatorOptions: object = {}) {
        const env = createEnv();

        env.register(
            require.resolve(`./generators/${type}`),
            `vcd-ext:${type}`
        );

        await new Promise<void>((resolve, reject) => {
            env.run(`vcd-ext:${type}`, generatorOptions, (err: Error | null) => {
                if (err) { reject(err); } else { resolve(); }
            });
        });
    }
}
