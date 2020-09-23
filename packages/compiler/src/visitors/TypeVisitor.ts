import * as ts from "typescript";
import VisitorContext from '../VisitorContext';

export default class TypeVisitor {

    constructor(private context: VisitorContext) { }

    visit(node: ts.ClassDeclaration) {
        const schemaGenerator = this.context.getSchemaGenerator();
        const name = node.name.text;
        const jsDoc = node['jsDoc']
        const description = jsDoc ? jsDoc[0].comment : "";
        const schema = schemaGenerator.createSchema(name);
        let interfaces = []
        let accessControls = []
        if (node.heritageClauses) {
            const typesList = node.heritageClauses
                .filter(hc => hc.token === ts.SyntaxKind.ImplementsKeyword)[0]
            if (typesList) {
                interfaces = typesList.types
                    .map(expr => expr.expression.getText())
                    .map(n => `urn:vcloud:interface:${this.context.vendor}:${this.context.nssPrefix || ""}${n.toLowerCase()}:${this.context.version}`)
                accessControls = node.members
                    .filter(m => m.kind == ts.SyntaxKind.MethodDeclaration)
                    .map((member) => {
                        const callExpr = member.decorators[0].expression as ts.CallExpression
                        return {
                            behaviorId: interfaces[0].replace(':interface:', `:behavior-interface:${member.name.getText()}:`),
                            accessLevelId: (callExpr.arguments[0] as ts.StringLiteral).text
                        }
                    })

            }
        }

        this.context.output.types[name] = {
            name,
            "nss": `${this.context.nssPrefix || ""}${name.toLowerCase()}`,
            "version": this.context.version,
            description,
            "vendor": this.context.vendor,
            schema,
            interfaces,
            accessControls
        }
    }
}