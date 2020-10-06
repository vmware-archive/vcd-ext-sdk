import * as fs from "fs";
import * as path from "path";
import { ElementType } from './ElementType';

const CARE_PACKAGE_DESCRIPTOR_NAME = 'care.json'
const ELEMENT_TYPE_DEFAULTS: any = {
    types : {
        outDir: "lib",
        files: "**/*.json"
    },
    uiPlugin: {
        outDir: "dist",
        files: "*.zip"
    }
}
export interface Element {
    type: ElementType,
    base: string,
    outDir: string,
    files: string
}

export interface CarePackageSpec {
    elements: Element[]
}

export class CarePackage {
    private spec: CarePackageSpec

    private constructor(public packageRoot: string, spec: any) {
        this.spec = {
            ...spec,
            elements: spec.elements.map((ele: any) => {
                return {
                    type: ele.type,
                    base: ele.base,
                    outDir: ele.outDir || ELEMENT_TYPE_DEFAULTS[ele.type].outDir,
                    files: ele.files || ELEMENT_TYPE_DEFAULTS[ele.type].files
                }
            })
        }
    } 

    public getElementAt(location: string): Element | undefined {
        return this.spec.elements.find(element => path.resolve(this.packageRoot, element.base) === location)
    }

    public get elements(): Element[] {
        return this.spec.elements
    }

    public get manifest(): any {
        return {
            ...this.spec,
            elements: this.spec.elements.map(ele => {
                let location = path.join(ele.base, ele.files || "**/*")
                location = location.indexOf('./') === 0 ? location.substr(2) : location
                return {
                    type: ele.type,
                    location
                }
            })
        }
    }

    static load() {
        let currentDir = process.cwd()
        while (!fs.existsSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME)) &&
                path.dirname(currentDir) !== currentDir) {
            currentDir = path.dirname(currentDir)
        }
        if (!fs.existsSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME))) {
            throw new Error(`CARE package descriptor missing: ${CARE_PACKAGE_DESCRIPTOR_NAME}`)
        }
        let fileContent = fs.readFileSync(path.join(currentDir, CARE_PACKAGE_DESCRIPTOR_NAME)).toString();
        return new CarePackage(currentDir, JSON.parse(fileContent));
    }
}