import { } from 'jasmine';
import { JSONSchemaPrompt } from './JSONSchemaPrompt';

describe('JSONSchemaPrompt Tests', () => {
    it('Generate question for simple property', () => {
        const testSchema = {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'name'
                }
            }
        };
        const questions = JSONSchemaPrompt.convertToPromptQuestions(testSchema);
        expect(questions.length).toBe(1);
        expect(questions[0]).toEqual(jasmine.objectContaining({
            name: 'name',
            message: 'name',
            default: undefined,
        }));
        expect(questions[0].validate).toBeDefined();
        if (questions[0].validate) {
            expect(questions[0].validate('string_value')).toBeTrue();
            expect(questions[0].validate('')).toBeTrue();
        }
    });
    it('Generate question for required property', () => {
        const testSchema = {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'name',
                    minLength: 1
                }
            },
            required:["name"]
        };
        const questions = JSONSchemaPrompt.convertToPromptQuestions(testSchema);
        expect(questions.length).toBe(1);
        expect(questions[0]).toEqual(jasmine.objectContaining({
            name: 'name',
            message: 'name',
            default: undefined,
        }));
        expect(questions[0].validate).toBeDefined();
        if (questions[0].validate) {
            expect(questions[0].validate('string_value')).toBeTrue();
            expect((questions[0].validate('') as string).indexOf('Please insert correct value')).toBeGreaterThan(-1);
            expect((questions[0].validate(undefined) as string).indexOf('Please insert correct value')).toBeGreaterThan(-1);
        }
    });
    it('Generate question with proper validation', () => {
        const testSchema = {
            type: 'object',
            properties: {
                name: {
                    type: 'number',
                    description: 'name'
                }
            }
        };
        const questions = JSONSchemaPrompt.convertToPromptQuestions(testSchema);
        expect(questions[0].validate).toBeDefined();
        if (questions[0].validate) {
            expect((questions[0].validate('') as string).indexOf('Please insert correct value')).toBeGreaterThan(-1);
            expect((questions[0].validate('string_value') as string).indexOf('Please insert correct value')).toBeGreaterThan(-1);
        }
    });

});
