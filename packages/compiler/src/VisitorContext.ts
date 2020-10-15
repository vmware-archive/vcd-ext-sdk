import * as ts from "typescript";
import * as sg from 'ts-json-schema-generator';
import debug from 'debug';

const log = debug('vcd:ext:compiler:visitorcontext')

export default class VisitorContext {
    output = {
        types: {},
        interfaces: {}
    }
    sg: sg.SchemaGenerator;
    typeChecker: ts.TypeChecker;

    constructor(private program: ts.Program,
                public name: string,
                public nssPrefix: string,
                public vendor: string,
                public version: string,
                private schemaGeneratorConfig: sg.Config = {}){
        this.typeChecker = program.getTypeChecker();
    }

    getSchemaGenerator() {
        if (!this.sg) {
            const config: sg.Config = {
                topRef: true,
                expose: 'export',
                jsDoc: 'extended',
                extraTags: [],
                ...this.schemaGeneratorConfig
            }
            log("Creating schema generator with config", config);
            const parser = sg.createParser(this.program, config);
            this.sg = new sg.SchemaGenerator(this.program, parser, sg.createFormatter(config));
        }
        return this.sg;
    }
}