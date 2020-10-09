import * as fs from "fs";
import * as path from "path";
import { ElementType } from './ElementType';

const CARE_PACKAGE_DESCRIPTOR_NAME = 'care.json'
const ELEMENT_TYPE_DEFAULTS: any = {
    types: {
        outDir: "lib",
        files: "**/*.json"
    },
    uiPlugin: {
        outDir: "dist",
        files: "*.zip"
    }
}
export interface ElementSource extends Element {
    base: string,
    outDir: string,
    files: string,
}

export interface Element {
    type: ElementType,
    location: string,
}

export interface CarePackageSourceSpec {
    name?: string,
    version?: string,
    vendor: string,
    specVersion: string,
    elements: ElementSource[]
}

export interface CarePackageSpec {
    name: string,
    version: string,
    vendor: string,
    specVersion: string,
    elements: Element[]
}

export class CarePackageSource {
    private spec: CarePackageSourceSpec

    constructor(public packageRoot: string, spec: any) {
        this.spec = {
            ...spec,
            elements: spec.elements.map((ele: any) => {
                const outDir = ele.outDir || ELEMENT_TYPE_DEFAULTS[ele.type].outDir
                const files = ele.files || ELEMENT_TYPE_DEFAULTS[ele.type].files
                return {
                    type: ele.type,
                    base: ele.base,
                    outDir,
                    files,
                    location: path.join(ele.base, outDir, files)
                }
            })
        }
    }

    public getElementAt(location: string): ElementSource | undefined {
        return this.spec.elements.find(element => path.resolve(this.packageRoot, element.base) === location)
    }

    public get elements(): ElementSource[] {
        return this.spec.elements
    }

    public toPackage(defaultName: string, defaultVersion: string): CarePackage {
        return new CarePackage(this.packageRoot, {
            ...this.spec,
            name: this.spec.name || defaultName,
            version: this.spec.version || defaultVersion,
            elements: this.spec.elements.map(ele => {
                let location = path.join(ele.base, ele.files)
                location = location.indexOf('./') === 0 ? location.substr(2) : location
                return {
                    type: ele.type,
                    location
                }
            })
        })
    }
}
export class CarePackage {

    constructor(public packageRoot: string, private spec: CarePackageSpec) {
    }

    public get elements(): Element[] {
        return this.spec.elements
    }

    public get manifest(): CarePackageSpec {
        return this.spec
    }

    static loadFromSource() {
        let currentDir = process.cwd()
        while (!fs.existsSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME)) &&
            path.dirname(currentDir) !== currentDir) {
            currentDir = path.dirname(currentDir)
        }
        if (!fs.existsSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME))) {
            throw new Error(`CARE package descriptor missing: ${CARE_PACKAGE_DESCRIPTOR_NAME}`)
        }
        const fileContent = fs.readFileSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME)).toString();
        return new CarePackageSource(currentDir, JSON.parse(fileContent));
    }

    static loadFromPackage(packageDir: string, descriptorName: string) {
        let fileContent = fs.readFileSync(path.join(packageDir, descriptorName)).toString();
        return new CarePackage(packageDir, JSON.parse(fileContent));
    }
}