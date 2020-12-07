import { Plugin } from '@vcd/care-package-plugins';
import debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import PluginLoader from './plugins/PluginLoader';
const CARE_PACKAGE_DESCRIPTOR_NAME = 'care.json';

const log = debug('vcd:ext:deployer');

export interface Element {
    name: string;
    type: string;
    location?: string | { base?: string, outDir?: string };
}

export interface CarePackageSpec {
    name: string;
    version: string;
    vendor: string;
    specVersion: string;
    elements: Element[];
}

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
        const fileContent = fs.readFileSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME)).toString();
        const spec = JSON.parse(fileContent) as CarePackageSpec;
        spec.name = spec.name || pjson.name;
        spec.version = spec.version || pjson.version;
        const plugins: Plugin[] = await PluginLoader.load([...new Set(spec.elements.map(ele => ele.type))]);
        return new CarePackage(currentDir, spec, true, plugins);
    }

    private getPluginForType(type: string): Plugin {
        return this.plugins.find(p => p.module === type);
    }

    private async runOperationOnElements(opName: string, only: string) {
        let elements  = this.spec.elements;
        if (only) {
            const onlyArr = only.split(',').map(p => p.trim());
            elements = elements.filter(ele => onlyArr.includes(ele.name));
        }
        return elements
            .filter(ele => !!this.getPluginForType(ele.type)[opName])
            .reduce(async (prevPromise, ele) => {
                await prevPromise;
                return this.getPluginForType(ele.type)[opName](this.packageRoot, this.spec, ele).catch(e => log(e));
            }, Promise.resolve()).catch(e => log(e));
    }

    async build(only: string) {
        if (!this.fromSource) {
            throw new Error('Build operation can only be triggered from CARE package source project');
        }
        return this.runOperationOnElements('build', only);
    }

}
