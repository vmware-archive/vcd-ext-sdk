const pjson = require('../../package.json');
import * as path from 'path';
import * as Generator from 'yeoman-generator';
import { CarePackageGenerator } from '@vcd/care-package';
import { JSONSchemaPrompt } from '../prompt/JSONSchemaPrompt';

export default class New extends Generator {
    answers: any;
    packageGenerator: CarePackageGenerator | null = null;
    additionalPlugins: string[];

    constructor(args: any, opts: any) {
        super(args, opts);
        this.additionalPlugins = opts.additionalPlugins;
        this.answers = {
            version: opts.version || '1.0.0',
            description: opts.description || '',
            cliVersion: pjson.version
        };
    }

    async prompting() {
        this.packageGenerator = await CarePackageGenerator.withPlugins(this.additionalPlugins);
        const createSpec = this.packageGenerator.getCreateSpec();
        let questions = JSONSchemaPrompt.convertToPromptQuestions(createSpec.createSchema);

        questions.push({
            type: 'checkbox',
            name: 'elements',
            message: 'Select extensibility elements',
            choices: createSpec.elements.map((element) => {
                return { name: element.displayName, value: element.name };
            }),
        });

        createSpec.elements.forEach(element => {
            const pluginQuestions = JSONSchemaPrompt.convertToPromptQuestions(element.newActions.getInputSchema('generate'), {
                name: {
                    default: element.name
                }
            });
            questions = questions.concat(pluginQuestions.map(question => {
                return {
                    ...question,
                    name: `${element.name}:${question.name}`,
                    message: `${element.displayName}:${question.message}`,
                    when: (answers) => answers.elements ? answers.elements.find((ele: string) => ele === element.name) : false,
                };
            }));
        });

        const ans = await this.prompt(questions);
        this.answers = Object.keys(ans)
            .filter(key => key.includes(':'))
            .reduce((prev: any, key) => {
                const pluginName = key.split(':')[0];
                const propertyName = key.split(':')[1];
                if (!prev.elements[pluginName]) {
                    prev.elements[pluginName] = {};
                }
                prev.elements[pluginName][propertyName] = ans[key];
                return prev;
            }, {
                ...this.answers,
                ...ans,
                elements: {}
            });
    }

    writing() {
        this.destinationRoot(path.resolve(this.answers.name));
        process.chdir(this.destinationRoot());
        this.packageGenerator?.generate(this, this.answers);
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
