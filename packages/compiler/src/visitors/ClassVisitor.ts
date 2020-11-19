import * as ts from 'typescript';
import VisitorContext from '../VisitorContext';
import TypeVisitor from './TypeVisitor';
import InterfaceVisitor from './InterfaceVisitor';

const TAGS: string[] = ['definedEntityType', 'definedEntityInterface'];

export default class ClassVisitor {


    constructor(private context: VisitorContext) { }

    private isNodeExported(node: ts.Declaration): boolean {
        return (
            // tslint:disable-next-line: no-bitwise
            (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
        );
    }

    private isExtensibilityType(node: ts.Node): boolean {
        return ts.getJSDocTags(node).some(jsDocTag => {
            return TAGS.indexOf(jsDocTag.tagName ? jsDocTag.tagName.escapedText.toString() : '') > -1;
        });
    }

    visit(node: ts.Node) {
        if (!this.isNodeExported(node as ts.Declaration) || !this.isExtensibilityType(node)) {
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
