import * as os from 'os';
import debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import * as semver from 'semver';
import * as uuid from 'uuid';
import { CarePackageSpec, CloudDirectorConfig } from '@vcd/care-package-def';
import { CellApi } from '@vcd/node-client';
import PluginLoader, { PluginExtended } from './plugins/PluginLoader';

const CARE_PACKAGE_DESCRIPTOR_NAME = 'care.json';
const DIST_FOLDER_NAME = 'dist';

const log = debug('vcd:ext:care-package');

/**
 * Loads a package.json
 * @param root - root folder of package.json
 */
const loadPackageJson = (root: string) => {
    const pjsonPath = path.resolve(root, 'package.json');
    if (!fs.existsSync(pjsonPath)) {
        throw new Error('Missing package.json');
    }
    const fileContent = fs.readFileSync(pjsonPath).toString();
    return JSON.parse(fileContent);
};

export class CarePackage {
    /**
     * @param packageRoot - root directory of a solution
     * @param spec - CARE package spec
     * @param fromSource - whether the care package instance is loaded from the source code
     * @param plugins - all plugins in a solution
     */
    constructor(
        public packageRoot: string,
        public spec: CarePackageSpec,
        private fromSource: boolean,
        private plugins: PluginExtended[]
    ) { }

    /**
     * Factory for the CarePackage type
     * @param packageRoot - root directory of a solution
     * @param descriptorName - this is the name of the file specification for CARE package i.e. care.json (from source)
     * or manifest.json (from CARE package)
     * @param fromSource - whether the care package instance is loaded from the source code
     * @param defaults - default values for name and version
     */
    private static async load(packageRoot: string, descriptorName: string, fromSource: boolean, defaults?: any) {
        console.log(`Loading package with root: ${packageRoot}`);
        const fileContent = fs.readFileSync(path.join(packageRoot, descriptorName)).toString();
        const spec = JSON.parse(fileContent) as CarePackageSpec;
        spec.name = spec.name || defaults?.name;
        spec.version = spec.version || defaults?.version;
        const plugins: PluginExtended[] = await PluginLoader.load([...new Set(spec.elements.map(ele => ele.type))]);
        return new CarePackage(packageRoot, spec, fromSource, plugins);
    }

    /**
     * Loads the CARE package from source code. Can be called from either the solution root or any of its child directories
     */
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

    /**
     * Loads the CARE package from a CARE package archive file. It unzips the archive into a temp OS directory and loads
     * it from there.
     */
    static async loadFromPackage(packagePath: string) {
        const zip = new AdmZip(packagePath);
        const packageRoot = path.join(os.tmpdir(), uuid.v4());
        console.log(`Extracting package with source file: ${packagePath} to packageRoot: ${packageRoot}`);
        zip.extractAllTo(packageRoot, true);
        // TODO extract 'manifest.json' as a const variable
        return this.load(packageRoot, 'manifest.json', false);
    }

    /**
     * Find function for finding a particular plugin by type
     * @param type - plugin type
     */
    private getPluginForType(type: string): PluginExtended {
        return this.plugins.find(p => p.module === type);
    }

    /**
     * A generic plugin action implementation invoking a particular action for a set of elements,
     * grouped by plugin type.
     * @param opName - plugin action name
     * @param only - A coma separated list of elements names defining a subset of elements over which
     * action execution occurs
     * @param clientConfig - VCD client factory for various clients
     * @param options - action specific parameters
     */
    // TODO refactor opName - operation name -> action name
    // TODO options can be extracted and defined per action
    private async runOperationOnElements(opName: string, only: string, clientConfig?: CloudDirectorConfig, options?: any) {
        // TODO buildActions and deployActions are properties in Plugin interface - shouldn't be hardcoded?
        const opType: string = this.fromSource ? 'buildActions' : 'deployActions';
        let elements = this.spec.elements;
        if (only) {
            const onlyArr = only.split(',').map(p => p.trim());
            elements = elements.filter(ele => onlyArr.includes(ele.name));
        }
        const elementGroups: any = elements
            .reduce((prev, ele) => {
                const plugin = this.getPluginForType(ele.type);
                if (!!plugin[opType][opName]) {
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
                return group.plugin[opType][opName]({
                    packageRoot: this.packageRoot,
                    careSpec: this.spec,
                    elements: group.elements,
                    clientConfig,
                    options
                })
                    .then(result => accumulator.concat(result))
                    .catch(console.error);
            }, Promise.resolve([]));
    }

    /**
     * Builds a solution
     * @param only - A coma separated list of elements names defining a subset of elements over which
     * action execution occurs
     * @param options - action specific parameters
     */
    // TODO options can be extracted and defined per action
    async build(only: string, options?: any) {
        if (!this.fromSource) {
            throw new Error('Build operation can only be triggered from CARE package source project');
        }
        // TODO extract 'build' as a const variable
        return this.runOperationOnElements('build', only, null, options);
    }

    /**
     * Serves a solution in emulators
     * @param only - A coma separated list of elements names defining a subset of elements over which
     * action execution occurs
     * @param clientConfig - VCD client factory for various clients
     * @param options - action specific parameters
     */
    // TODO options can be extracted and defined per action
    async serve(only: string, clientConfig: CloudDirectorConfig, options?: any) {
        if (!this.fromSource) {
            throw new Error('Serve operation can only be triggered from CARE package source project');
        }
        // TODO extract 'serve' as a const variable
        return this.runOperationOnElements('serve', only, clientConfig, options);
    }

    /**
     * Packages the solution ont a CARE package.
     * @param only - A coma separated list of elements names defining a subset of elements over which
     * action execution occurs
     * @param options - action specific parameters
     */
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
        // TODO extract 'pack' as a const variable
        const elements = await this.runOperationOnElements('pack', only, null, options);
        const manifest = {
            ...this.spec,
            elements
        };
        const content = JSON.stringify(manifest);
        // TODO extract 'manifest.json' as a const variable
        zip.addFile('manifest.json', Buffer.alloc(content.length, content));
        zip.writeZip(path.join(dist, name));
        console.log(`Creating CARE package: ${path.join(dist, name)}`);
    }

    /**
     * Deploys either a solution or a specific element from a solution
     * @param only - A coma separated list of elements names defining a subset of elements over which
     * action execution occurs
     * @param clientConfig - VCD client factory for various clients
     * @param options - action specific parameters
     */
    async deploy(only: string, clientConfig: CloudDirectorConfig, options?: any) {
        // TODO extract 'deploy' as a const variable
        await this.validatePlatformVersion(clientConfig);
        return this.runOperationOnElements('deploy', only, clientConfig, options);
    }

    async validatePlatformVersion(clientConfig: CloudDirectorConfig) {
        const cellApi = clientConfig.makeApiClient(CellApi);
        const cellsResp = await cellApi.queryCells(1, 1);
        if (this.spec.platformVersion && semver.gt(this.spec.platformVersion, cellsResp.body.values[0].productVersion)) {
            throw new Error(`Platform version mismatch expected greater or equal to ${this.spec.platformVersion}` +
                ` got ${cellsResp.body.values[0].productVersion}`);
        }
    }

}

