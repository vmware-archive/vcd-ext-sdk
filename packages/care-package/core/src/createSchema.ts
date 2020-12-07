import { Schema } from 'ts-json-schema-generator';

export const createSchema: Schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Your solution name'
        },
        version: {
            type: 'string',
            description: 'Specify first version',
            default: '0.0.1'
        },
        vendor: {
            type: 'string',
            description: 'Specify vendor name'
        },
        link: {
            type: 'string',
            description: 'Specify vendor link',
            default: 'http://example.com'
        },
        license: {
            type: 'string',
            description: 'Specify solution license',
            default: 'BSD-2-Clause'
        }
    }
};
