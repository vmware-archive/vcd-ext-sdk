import { } from 'jasmine';
import New from './new';
import * as helpers from 'yeoman-test';
import * as assert from 'yeoman-assert';

describe('New Generator Tests', () => {
    it('Generate empty project', async () => {
        return helpers.run(New)
            .withOptions({name: 'test'})
            .withPrompts({
                name: 'test',
                version: '0.0.1',
                vendor: 'VMware',
                link: 'http://example.com',
                license: 'BSD'
             })
             .then(() => {
                assert.file(['package.json', 'care.json']);
             });
    });
    it('Generate types project', async () => {
        await helpers.run(New)
            .withOptions({name: 'test'})
            .withPrompts({
                name: 'test',
                version: '0.0.1',
                vendor: 'VMware',
                link: 'http://example.com',
                license: 'BSD',
                elements: ['types'],
                'types:name': 'types'
             })
             .then(() => {
                assert.file('packages/types/package.json');
             });
    });
    it('Generate uiPlugin project', async () => {
        await helpers.run(New)
            .withOptions({name: 'test'})
            .withPrompts({
                name: 'test',
                version: '0.0.1',
                vendor: 'VMware',
                link: 'http://example.com',
                license: 'BSD',
                elements: ['uiPlugin'],
                'uiPlugin:name': 'uiPlugin'
             })
             .then(() => {
                assert.file('packages/uiPlugin/package.json');
             });
    });
});
