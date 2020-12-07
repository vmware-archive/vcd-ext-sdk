import { Schema } from 'ts-json-schema-generator';
import * as Generator from 'yeoman-generator';

export interface Plugin {
    module: string;
    name: string;
    displayName: string;
    createSchema: Schema;
    generate?(generator: Generator, answers: any);
    build?(packageRoot: string, careSpec: any, element: any);
    serve?(packageRoot: string, careSpec: any, element: any);
    pack?(packageRoot: string, careSpec: any, element: any);
    deploy?(packageRoot: string, careSpec: any, element: any);
}
