const { schemaWalk } = require('@cloudflare/json-schema-walker');
import validator = require('is-my-json-valid');
import _ = require('lodash');
import { Question } from 'yeoman-generator';

export class JSONSchemaPrompt {

    static convertToPromptQuestions(schema: any, predefinedValues: any = {}) {
        const questions: Question[] = [];
        schemaWalk(schema, (subschema: any, path: string[], parent: any) => {
            if (!parent || path.length === 0) {
                return;
            }
            const validate = validator(subschema, { verbose: true });
            const name = path.pop() as string;
            const question: any = {
                name,
                default: subschema.default,
                message: subschema.description || name,
                validate: (value: any) => {
                    if (!validate(value)) {
                        return 'Please insert correct value (' + _.first(validate.errors)?.message + ')';
                    }
                    return true;
                },
                ...(predefinedValues[name] || {})
            };
            const choices = subschema.enum;
            if (Array.isArray(choices)) {
                question.type = 'list';
                question.choices = choices;
            } else if (subschema.type === 'boolean') {
                question.type = 'confirm';
            } else {
                question.type = 'input';
            }
            questions.push(question);
        });
        return questions;
    }
}
