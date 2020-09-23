import * as ts from "typescript";
import VisitorContext from '../VisitorContext';
import TypeVisitor from './TypeVisitor';
import InterfaceVisitor from './InterfaceVisitor';

export default class ClassVisitor {

    constructor(private context: VisitorContext) { }

    private isNodeExported(node: ts.Declaration): boolean {
        return (
            (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
        );
    }

    visit(node: ts.Node) {
        if (!this.isNodeExported(node as ts.Declaration)) {
            return;
        }
        if (ts.isClassDeclaration(node) && node.name) {
            new TypeVisitor(this.context).visit(node);
        }
        if (ts.isInterfaceDeclaration(node) && node.name) {
            new InterfaceVisitor(this.context).visit(node);
        }
    }
}