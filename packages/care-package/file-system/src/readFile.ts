import * as fs from 'fs';

export const readFile = (file: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, buff) => {
            if (err) {
                reject(err);
            }
            resolve(buff);
        });
    });
};

