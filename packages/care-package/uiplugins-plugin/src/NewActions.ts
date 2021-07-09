import {BaseNewActions} from '@vcd/care-package-plugin-abstract';
import {emulatorDeps} from './Constants';
import * as Generator from 'yeoman-generator';
import {Plugin} from '@vcd/care-package-def';

export class NewActions extends BaseNewActions {

    generate(plugin: Plugin, generator: Generator, answers: any) {
        super.generate(plugin, generator, answers);

        const templatePath = generator.templatePath('emulator');
        const destinationPath = generator.destinationPath();
        generator.fs.copyTpl(
            templatePath,
            destinationPath,
            answers,
            undefined,
            { globOptions: { dot: true } });

        const packageJsonPath = generator.destinationPath('package.json');
        generator.fs.extendJSON(packageJsonPath, emulatorDeps);
    }
}
