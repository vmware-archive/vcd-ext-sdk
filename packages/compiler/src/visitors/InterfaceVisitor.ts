import * as ts from 'typescript';
import VisitorContext from '../VisitorContext';

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export default class InterfaceVisitor {

    constructor(private context: VisitorContext) { }

    visit(node: ts.InterfaceDeclaration) {
        const name = node.name.text;

        const behaviors = [];
        node.members
            .filter(child => ts.isMethodSignature(child))
            .forEach(child => {
                const methodName = child.name.getText();
                behaviors.push({
                    name: methodName,
                    execution: { type: 'Activity', id: `${capitalize(methodName)}Activity` }
                });
            });
        this.context.output.interfaces[name] = {
            name,
            nss: `${this.context.nssPrefix || ''}${name.toLowerCase()}`,
            version: this.context.version,
            vendor: this.context.vendor,
            behaviors
        };
    }
}
