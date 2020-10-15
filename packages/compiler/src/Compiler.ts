import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { sync as globSync } from "glob";
import ClassVisitor from './visitors/ClassVisitor';
import VisitorContext from './VisitorContext';

const SCHEMA_GENERATOR_PROPERTIES = [
    "sortProps",
    "strictTuples",
    "skipTypeCheck",
    "encodeRefs",
    "additionalProperties"
]

export class Compiler {
    rootDir: string;
    fileNames: any;
    outDir: string;
    checker: ts.TypeChecker;
    output: any[] = [];
    config: any;
    vendorPrefix: string;
    schemaGeneratorConfig: any = {}

    constructor(files: string[], flags: any) {
        this.config = flags;
        this.rootDir = flags.rootDir || process.cwd();
        this.outDir = flags.outDir || "lib";
        this.fileNames = files && files.length
            ? files.map(file => path.resolve(this.rootDir, file))
            : globSync(path.resolve(this.rootDir, 'src', "**/*.ts"));
        
        this.schemaGeneratorConfig = Object.keys(flags)
            .filter(key => SCHEMA_GENERATOR_PROPERTIES.indexOf(key) > -1)
            .reduce((acc: any, key: string) => {
                acc[key] = flags[key]
                return acc
            }, this.schemaGeneratorConfig)
    }

    private logDiagnostics(diagnostics: readonly ts.Diagnostic[]): void {
        for (let diagnostic of diagnostics) {
            let message = diagnostic.messageText;
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                message += ` - ${diagnostic.file.fileName} (${line + 1},${character + 1})`;
            }

            switch (diagnostic.category) {
                case ts.DiagnosticCategory.Error:
                    console.error(message);
                    break;
                case ts.DiagnosticCategory.Warning:
                    console.warn(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
        }
    }

    private loadPackageJson(): any {
        let pjsonPath = path.resolve(this.rootDir, "package.json");
        if (!fs.existsSync(pjsonPath)) {
            throw new Error("Missing package.json");
        }
        let fileContent = fs.readFileSync(pjsonPath).toString();
        return JSON.parse(fileContent);
    }

    private loadCompilerOptions(): ts.CompilerOptions {
        let options: ts.CompilerOptions;
        let tsconfigPath = path.resolve(this.rootDir, "tsconfig.json");

        if (fs.existsSync(tsconfigPath)) {
            let fileContent = fs.readFileSync(tsconfigPath).toString();
            let tsconfigOptions = JSON.parse(fileContent).compilerOptions;
            let optionsResult = ts.convertCompilerOptionsFromJson(tsconfigOptions, process.cwd());

            if (optionsResult.errors && optionsResult.errors.length) {
                this.logDiagnostics(optionsResult.errors);
                throw new Error(`Unable to load ${tsconfigPath}`);
            }

            options = optionsResult.options;
        }

        options = options || {};

        options.module = ts.ModuleKind.CommonJS;
        options.moduleResolution = ts.ModuleResolutionKind.NodeJs;
        options.target = ts.ScriptTarget.ES5;
        options.rootDir = this.rootDir;
        options.outDir = this.outDir;
        options.baseUrl = this.rootDir;
        options.stripInternal = false;
        options.removeComments = false;
        options.emitDeclarationOnly = true;
        options.experimentalDecorators = true;
        options.declaration = true;
        options.strictNullChecks = false;

        return options;
    }

    compile(): void {
        let program = ts.createProgram(this.fileNames, this.loadCompilerOptions());
        let emitResult = program.emit();

        if (!this.config.skipTypeCheck) {
            let diagnostics = ts.getPreEmitDiagnostics(program)
                .concat(emitResult.diagnostics);
            if (diagnostics.length) {
                this.logDiagnostics(diagnostics);
                throw new Error('Error compiling program');
            }
        }
        const pjson = this.loadPackageJson();
        const name = pjson.name.replace(new RegExp("@.*\/", 'g'), "");

        const context = new VisitorContext(
            program,
            name,
            pjson.nssPrefix,
            pjson.vendor,
            pjson.version,
            this.schemaGeneratorConfig
        );
        const visitor = new ClassVisitor(context);

        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, visitor.visit.bind(visitor));
            }
        }
        Object.keys(context.output).forEach(collection => {
            fs.mkdirSync(path.resolve(this.outDir, collection), { recursive: true })
            Object.keys(context.output[collection]).forEach(name => {
                fs.writeFile(path.resolve(this.outDir, collection, `${name}.json`), JSON.stringify(context.output[collection][name]), err => {
                    if (err) {
                        console.error(`Error creating file: ${name}.yaml. Error: ${err}`);
                        return;
                    }
                    console.log(`Writing file: ${name}.json`);
                })
            })
        })
    }
}
