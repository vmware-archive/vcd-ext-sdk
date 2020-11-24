import * as fs from 'fs';
import * as path from 'path';
import { sync as globSync } from 'glob';
import * as AdmZip from 'adm-zip';

import Command, { flags } from '@oclif/command';
import { CarePackage} from '../care';

const DIST_FOLDER_NAME = 'dist';

const loadPackageJson = (root: string) => {
    const pjsonPath = path.resolve(root, 'package.json');
    if (!fs.existsSync(pjsonPath)) {
        throw new Error('Missing package.json');
    }
    const fileContent = fs.readFileSync(pjsonPath).toString();
    return JSON.parse(fileContent);
};

export default class Pack extends Command {

    static description = `Packages the contents of the solution project into a CARE package.
    File name can be provided as optional parameter.`;

    static examples = [
        `$ vcd-ext pack`,
        `$ vcd-ext pack mypackagename.zip`,
    ];

    static flags = {
        help: flags.help({ char: 'h', description: 'Provides usage for the current command.' }),
    };

    static args = [{ name: 'name', required: false, description: 'Optional archive name' }];
    type = 'pack';

    async run() {
        const { args } = this.parse(Pack);

        const carePackage = CarePackage.loadFromSource();
        const pjson = loadPackageJson(carePackage.packageRoot);
        const dist = path.join(carePackage.packageRoot, DIST_FOLDER_NAME);
        const name = args.name || `${pjson.name}.care`;

        if (!fs.existsSync(dist)) {
            fs.mkdirSync(dist, { recursive: true });
        }
        const zip = new AdmZip();
        const manifest = carePackage.toPackage(pjson.name, pjson.version).manifest;
        const content = JSON.stringify(manifest);
        zip.addFile('manifest.json', Buffer.alloc(content.length, content));
        carePackage.elements.forEach(ele => {
            globSync(path.join(carePackage.packageRoot, ele.base, ele.outDir, ele.files))
                .forEach(file => {
                    const relativePath = path.dirname(
                        path.relative(
                            path.join(carePackage.packageRoot, ele.base, ele.outDir), file)
                    );
                    zip.addLocalFile(file, path.join(ele.base, relativePath));
                });
        });
        zip.writeZip(path.join(dist, name));
    }
}
