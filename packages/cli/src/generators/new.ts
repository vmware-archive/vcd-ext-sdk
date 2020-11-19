import * as path from 'path';
import * as camelcase from 'camelcase';
import Generator = require('yeoman-generator');

export default class New extends Generator {
    name: any;
    version: any;
    vendor: any;
    answers: any;
    components: any = {};
    elements = [];
    nameCamelCase: string;

    constructor(args: any, opts: any) {
        super(args, opts);
        this.name = opts.name;
        this.nameCamelCase = camelcase(this.name, { pascalCase: true });
        this.version = opts.version || '1.0.0';
        this.description = opts.description || '';
        this.answers = {};
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your solution name',
                default: this.name
            }, {
                type: 'input',
                name: 'version',
                message: 'Specify first version',
                default: '0.0.1'
            }, {
                type: 'input',
                name: 'vendor',
                message: 'Specify vendor name',
            }, {
                type: 'input',
                name: 'link',
                message: 'Specify vendor link',
                default: 'http://example.com'
            }, {
                type: 'input',
                name: 'license',
                message: 'Specify solution license',
                default: 'BSD-2-Clause',
            }, {
                type: 'checkbox',
                name: 'components',
                message: 'Select extensibility components',
                choices: [
                    { name: 'UI Plugin', value: 'uiPlugin' },
                    { name: 'Defined Entities', value: 'types' }
                ],
            }, {
                type: 'input',
                name: 'uiPluginName',
                when: (answers) => answers.components.find((component: string) => component === 'uiPlugin'),
                default: 'ui',
                message: 'Specify UI Plugin component name',
            }, {
                type: 'input',
                name: 'typesName',
                when: (answers) => answers.components.find((component: string) => component === 'types'),
                default: 'types',
                message: 'Specify Defined Entities component name',
            }
        ]);
    }

    writing() {
        this.destinationRoot(path.resolve(this.name));
        process.chdir(this.destinationRoot());
        this.sourceRoot(path.join(__dirname, '../../templates'));
        this.elements = this.answers.components.map((component: string) => {
            return {
                type: component,
                base: 'packages/' + this.answers[`${component}Name`]
            };
        });
        this.vendor = this.answers.vendor;
        this.name = this.answers.name;
        this.nameCamelCase = camelcase(this.name, { pascalCase: true });
        this.fs.copyTpl(
            this.templatePath('new'),
            this.destinationPath(),
            this,
            undefined,
            { globOptions: { dot: true } });
        this.answers.components.forEach((component: string) => {
            this.components[component] = {
                name: `${this.name}-${this.answers[`${component}Name`]}`,
                componentName: this.answers[`${component}Name`],
                version: this.answers.version,
                description: this.description,
                vendor: this.answers.vendor,
            };
            this.sourceRoot(path.join(__dirname, '../../templates'));
            this.fs.copyTpl(
                this.templatePath(component),
                this.destinationPath('packages', this.answers[`${component}Name`]),
                this,
                undefined,
                { globOptions: { dot: true } });
        });
    }

    install() {
        this.spawnCommandSync('npm', ['install'], {
            cwd: this.destinationRoot()
        });
        this.spawnCommandSync('npm', ['run', 'bootstrap'], {
            cwd: this.destinationRoot()
        });
    }
}
