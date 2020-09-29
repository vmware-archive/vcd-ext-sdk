import * as ts from "typescript";
import * as sg from 'ts-json-schema-generator';

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
                public version: string){
        this.typeChecker = program.getTypeChecker();
    }

    getSchemaGenerator() {
        if (!this.sg) {
            const config: sg.Config = {
                topRef: true,
                expose: 'export',
                jsDoc: 'extended',
                extraJsonTags: []
            }
            const parser = sg.createParser(this.program, config);
            this.sg = new sg.SchemaGenerator(this.program, parser, sg.createFormatter());
        }
        return this.sg;
    }
}