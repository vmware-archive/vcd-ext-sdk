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
            required: true
        },
        version: {
            type: 'string',
            description: 'Specify first version',
            default: '0.0.1',
            required: true
        },
        vendor: {
            type: 'string',
            description: 'Specify vendor name',
            required: true
        },
        link: {
            type: 'string',
            description: 'Specify vendor link',
            default: 'http://example.com',
            required: true
        },
        license: {
            type: 'string',
            description: 'Specify solution license',
            default: 'BSD-2-Clause',
            required: true
        }
    }
};
