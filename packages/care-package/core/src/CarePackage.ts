import * as os from 'os';
import debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import * as uuid from 'uuid';
import { Plugin, CarePackageSpec } from '@vcd/care-package-def';
import PluginLoader from './plugins/PluginLoader';

const CARE_PACKAGE_DESCRIPTOR_NAME = 'care.json';
const DIST_FOLDER_NAME = 'dist';

const log = debug('vcd:ext:care-package');

const loadPackageJson = (root: string) => {
    const pjsonPath = path.resolve(root, 'package.json');
    if (!fs.existsSync(pjsonPath)) {
        throw new Error('Missing package.json');
    }
    const fileContent = fs.readFileSync(pjsonPath).toString();
    return JSON.parse(fileContent);
};

export class CarePackage {
    constructor(
        public packageRoot: string,
        public spec: CarePackageSpec,
        private fromSource: boolean,
        private plugins: Plugin[]
    ) {}

    private static async load(packageRoot: string, descriptorName: string, fromSource: boolean, defaults?: any) {
        console.log(`Loading package with root: ${packageRoot}`);
        const fileContent = fs.readFileSync(path.join(packageRoot, descriptorName)).toString();
        const spec = JSON.parse(fileContent) as CarePackageSpec;
        spec.name = spec.name || defaults?.name;
        spec.version = spec.version || defaults?.version;
        const plugins: Plugin[] = await PluginLoader.load([...new Set(spec.elements.map(ele => ele.type))]);
        return new CarePackage(packageRoot, spec, fromSource, plugins);

    }

    static async loadFromSource() {
        let currentDir = process.cwd();
        while (!fs.existsSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME)) &&
            path.dirname(currentDir) !== currentDir) {
            currentDir = path.dirname(currentDir);
        }
        if (!fs.existsSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME))) {
            throw new Error(`CARE package descriptor missing: ${CARE_PACKAGE_DESCRIPTOR_NAME}`);
        }
        const pjson = loadPackageJson(currentDir);
        return this.load(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME, true, pjson);
    }

    static async loadFromPackage(packagePath: string) {
        const zip = new AdmZip(packagePath);
        const packageRoot = path.join(os.tmpdir(), uuid.v4());
        console.log(`Extracting package with source file: ${packagePath} to packageRoot: ${packageRoot}`);
        zip.extractAllTo(packageRoot, true);
        return this.load(packageRoot, 'manifest.json', false);
    }

    private getPluginForType(type: string): Plugin {
        return this.plugins.find(p => p.module === type);
    }

    private async runOperationOnElements(opName: string, only: string, options?: any) {
        let elements  = this.spec.elements;
        if (only) {
            const onlyArr = only.split(',').map(p => p.trim());
            elements = elements.filter(ele => onlyArr.includes(ele.name));
        }
        const elementGroups: any = elements
            .reduce((prev, ele) => {
                const plugin = this.getPluginForType(ele.type);
                if (!!plugin[opName]) {
                    if (!prev[ele.type]) {
                        prev[ele.type] = {
                            plugin,
                            elements: []
                        };
                    }
                    prev[ele.type].elements.push(ele);
                }
                return prev;
            }, {});
        return Object.values(elementGroups)
            .reduce(async (prevPromise: Promise<any>, group: any): Promise<any> => {
                const accumulator = await prevPromise;
                console.log(`Running ${opName} for plugin ${group.plugin.module} with elements ${group.elements.map(e => e.name)}`);
                return group.plugin[opName](this.packageRoot, this.spec, group.elements, options)
                    .then(result => accumulator.concat(result))
                    .catch(console.error);
            }, Promise.resolve([]));
    }

    async build(only: string, options?: any) {
        if (!this.fromSource) {
            throw new Error('Build operation can only be triggered from CARE package source project');
        }
        return this.runOperationOnElements('build', only, options);
    }
    async serve(only: string, options?: any) {
        if (!this.fromSource) {
            throw new Error('Serve operation can only be triggered from CARE package source project');
        }
        return this.runOperationOnElements('serve', only, options);
    }

    async pack(only: string, options?: any) {
        if (!this.fromSource) {
            throw new Error('Serve operation can only be triggered from CARE package source project');
        }
        const dist = path.join(this.packageRoot, DIST_FOLDER_NAME);
        const name = options.name || `${this.spec.name}.care`;

        if (!fs.existsSync(dist)) {
            fs.mkdirSync(dist, { recursive: true });
        }
        const zip = new AdmZip();
        options.zip = zip;
        const elements = await this.runOperationOnElements('pack', only, options);
        const manifest = {
            ...this.spec,
            elements
        };
        const content = JSON.stringify(manifest);
        zip.addFile('manifest.json', Buffer.alloc(content.length, content));
        zip.writeZip(path.join(dist, name));
        console.log(`Creating CARE package: ${path.join(dist, name)}`);
    }

    async deploy(only: string, options?: any) {
        return this.runOperationOnElements('deploy', only, options);
    }
}
