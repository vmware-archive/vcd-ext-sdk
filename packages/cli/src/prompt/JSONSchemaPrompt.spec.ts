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
        expect(() => {
            // tslint:disable-next-line: no-unused-expression
            questions[0].validate ? questions[0].validate('string_value') : undefined;
        }).not.toThrow();
    });
});
