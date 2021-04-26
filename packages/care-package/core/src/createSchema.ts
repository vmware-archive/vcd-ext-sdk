export const createSchema = {
    type: 'object',
    required: [
        'name',
        'version',
        'vendor',
        'link',
        'license'
    ],
    properties: {
        name: {
            type: 'string',
            description: 'Your solution name',
            required: true,
            minLength: 1
        },
        version: {
            type: 'string',
            description: 'Specify first version',
            default: '0.0.1',
            required: true,
            minLength: 1
        },
        vendor: {
            type: 'string',
            description: 'Specify vendor name',
            required: true,
            minLength: 1
        },
        link: {
            type: 'string',
            description: 'Specify vendor link',
            default: 'http://example.com',
            required: true,
            minLength: 1
        },
        license: {
            type: 'string',
            description: 'Specify solution license',
            default: 'BSD-2-Clause',
            required: true,
            minLength: 1
        }
    }
};
