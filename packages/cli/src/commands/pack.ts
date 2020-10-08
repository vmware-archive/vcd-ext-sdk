import * as fs from "fs";
import * as path from "path";
import { sync as globSync } from "glob";
import * as AdmZip from 'adm-zip';

import Command, { flags } from '@oclif/command'
import { CarePackage} from '../care';
import { load } from '@oclif/config';

const DIST_FOLDER_NAME = 'dist'

const loadPackageJson = (root: string) => {
    let pjsonPath = path.resolve(root, "package.json");
    if (!fs.existsSync(pjsonPath)) {
        throw new Error("Missing package.json");
    }
    let fileContent = fs.readFileSync(pjsonPath).toString();
    return JSON.parse(fileContent);
}

export default class Pack extends Command {
    type: string = 'pack';

    static description = 'Packages the contents of the solution project into a CARE package'

    static examples = [
        `$ vcd-ext pack
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
    }

    static args = [{ name: 'name', required: false }]

    async run() {
        const { args } = this.parse(Pack)

        const carePackage = CarePackage.load()
        const pjson = loadPackageJson(carePackage.packageRoot)
        const dist = path.join(carePackage.packageRoot, DIST_FOLDER_NAME)
        const name = args.name || `${pjson.name}.care`;
        
        if (!fs.existsSync(dist)) {
            fs.mkdirSync(dist, { recursive: true })
        }
        const zip = new AdmZip();
        const manifest = carePackage.manifest;
        manifest.name = manifest.name || pjson.name;
        manifest.version = manifest.version || pjson.version;
        const content = JSON.stringify(manifest);
        zip.addFile('manifest.json', Buffer.alloc(content.length, content))
        carePackage.elements.forEach(ele => {
            globSync(path.join(carePackage.packageRoot, ele.base, ele.outDir, ele.files))
                .forEach(file => {
                    var relativePath = path.dirname(
                        path.relative(
                            path.join(carePackage.packageRoot, ele.base, ele.outDir), file)
                    );
                    zip.addLocalFile(file, path.join(ele.base, relativePath))
                })
        })
        zip.writeZip(path.join(dist, name))
    }
}
