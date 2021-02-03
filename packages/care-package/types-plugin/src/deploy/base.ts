import { glob, readFile } from '@vcd/file-system';
import { ComponentDeployer } from '@vcd/care-package-plugin-abstract';

const getIdComponent = (det: any): string => {
    return `${det.vendor}:${det.nss}:${det.version}`;
};

export abstract class BaseTypesDeployer implements ComponentDeployer {

    protected abstract getServerEntities(): Promise<any>;
    public abstract clean(location: string): Promise<any>;
    public abstract deploy(location: string): Promise<any>;
    protected abstract log(...args: any): void;

    protected async traverse(
        location: string,
        fileFilter: (file: string) => boolean,
        visitor: (det: any, existingDet?: any
    ) => Promise<any>) {
        const files = (await glob(location)).filter(fileFilter);
        const serverEntities = await this.getServerEntities();
        const existingDets = serverEntities.body.values
            .reduce((prev: any, curr: any) => {
                prev[getIdComponent(curr)] = curr;
                return prev;
            }, {});
        this.log(existingDets);
        return Promise.all(
            files.map(async file => {
                this.log(`Loading defined entity type from file: ${file}`);
                const det = JSON.parse((await readFile(file)).toString());
                const existingDet = existingDets[getIdComponent(det)];
                return visitor(det, existingDet).catch(e => this.log(e));
            })
        );
    }
}
