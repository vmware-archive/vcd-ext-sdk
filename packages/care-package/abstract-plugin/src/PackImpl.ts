import {ElementBase} from '@vcd/care-package-def';
import path from 'path';
import fs from 'fs';

export class PackImpl {

    pack(element: ElementBase, zip: any) {
        const pluginDirPath = path.join('packages', element.name);
        const allFiles: string[] = [];
        this.getFiles(pluginDirPath, allFiles);

        for (const file of allFiles) {
            console.log(`Adding file to care package: ${file}`);
            zip.addLocalFile(file, path.dirname(file));
        }
    }

    private getFiles(dir: string, allFiles: string[]) {
        allFiles = allFiles || [];
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const newPath = path.join(dir, file);
            if (fs.statSync(newPath).isDirectory()) {
                this.getFiles(newPath, allFiles);
            } else {
                allFiles.push(newPath);
            }
        });
        return allFiles;
    }
}
