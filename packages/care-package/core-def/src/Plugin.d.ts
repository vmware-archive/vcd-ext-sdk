import { JSONSchema7 } from 'json-schema';
import * as Generator from 'yeoman-generator';
import { CarePackageSourceSpec, CarePackageSpec, Element, ElementSource } from './CarePackage';

export interface Plugin {
    module: string;
    name: string;
    displayName: string;
    createSchema: JSONSchema7;
    generate?(generator: Generator, answers: any);
    build?(packageRoot: string, careSpec: CarePackageSourceSpec, elements: ElementSource[], options?: any);
    serve?(packageRoot: string, careSpec: CarePackageSourceSpec, elements: ElementSource[], options?: any);
    pack?(packageRoot: string, careSpec: CarePackageSourceSpec, elements: ElementSource[], options?: any);
    deploy?(packageRoot: string, careSpec: CarePackageSpec, elements: Element[], options?: any);
}
