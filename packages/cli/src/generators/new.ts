import * as path from 'path'
import * as camelcase from 'camelcase'
import Generator = require("yeoman-generator");

export default class New extends Generator {
    name: any;
    version: any;
    answers: any;
    components: any = {};
    nameCamelCase: string;

    constructor(args: any, opts: any) {
        super(args, opts);
        this.name = opts.name;
        this.nameCamelCase = camelcase(this.name, { pascalCase: true})
        this.version = opts.version || '1.0.0';
        this.description = opts.description || '';
        this.answers = {};
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'checkbox',
                name: 'components',
                message: 'Select extensibility components',
                choices: [
                    {name: 'UI Plugin', value: 'ui'},
                    {name: 'Defined Entities', value: 'types'}
                ],
            },
            {
                type: 'input',
                name: 'vendor',
                message: 'Specify vendor name',
            },
            {
                type: 'input',
                name: 'version',
                message: 'Specify version',
                default: '0.0.1'
            }
        ]);
    }

    writing() {
        this.destinationRoot(path.resolve(this.name))
        process.chdir(this.destinationRoot())
        this.sourceRoot(path.join(__dirname, '../../templates'))
        this.fs.copyTpl(
            this.templatePath('new'),
            this.destinationPath(),
            this,
            undefined,
            { globOptions: { dot: true }})
        this.answers.components.forEach((component: string) => {
            this.components[component] = {
                name: `${this.name}-${component}`,
                version: this.answers.version,
                description: this.description,
                vendor: this.answers.vendor,
            }
            this.sourceRoot(path.join(__dirname, '../../templates'))
            this.fs.copyTpl(
                this.templatePath(component),
                this.destinationPath('packages', component),
                this,
                undefined,
                { globOptions: { dot: true }})
        });
    }

    install() {
        this.spawnCommandSync('npm', ['install'], {
            cwd: this.destinationRoot()
        })
        this.spawnCommandSync('npm', ['run', 'bootstrap'], {
            cwd: this.destinationRoot()
        })
    }
}
