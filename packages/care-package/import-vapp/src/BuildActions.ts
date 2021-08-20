import * as careDef from '@vcd/care-package-def';
import { JSONSchema7 } from 'json-schema';
import * as fs from 'fs';
import * as Generator from 'yeoman-generator';
import { names } from './names';
import {ImportVApp} from './ImportVApp';
import {BuildActionParameters, Element} from '@vcd/care-package-def';
import path from 'path';

export class BuildActions implements careDef.BuildActions {

    getInputSchema(action: string): JSONSchema7 {
        if (action === 'generate') {
            return {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'element name'
                    }
                }
            };
        }
        return null;
    }

    getConfiguration?(): any {
        return {
            vAppName: '',
            instantiateOvfProperties: []
        };
    }

    generate(generator: Generator, answers: any) {
        let folderName = answers.elements[names.name].name || names.name;
        folderName = path.join(path.join('packages', folderName));
        fs.mkdirSync(folderName, { recursive: true });
    }

    pack({packageRoot, elements, options}: BuildActionParameters) {
        const elementSpecs: Element[] = elements.map(element => {
            const pluginDirPath = path.join(path.join('packages', element.name));
            const allFiles: string[] = [];
            this.getFiles(pluginDirPath, allFiles);

            allFiles.forEach(file => {
                console.log(`Adding file to package: ${file}`);
                options.zip.addLocalFile(file, path.dirname(file));
            });

            return {
                name: element.name,
                type: element.type,
                configuration: element.configuration
            };
        });
        return Promise.resolve(elementSpecs);
    }

    private getFiles(dir: string, allFiles: string[]) {
        allFiles = allFiles || [];
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const newPath = path.join(dir, file);
            if (fs.statSync(newPath).isDirectory()) {
                this.getFiles(newPath, allFiles);
            } else {
                allFiles.push(newPath);
            }
        });
        return allFiles;
    }

    async deploy(params: careDef.BuildActionParameters) {
        const importVApp = new ImportVApp(params.clientConfig);
        await importVApp.executeRequests(params.elements[0]);
    }
}
