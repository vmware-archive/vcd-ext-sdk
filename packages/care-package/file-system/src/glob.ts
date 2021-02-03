import * as nodeGlob from 'glob';

export const glob = (pattern: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        nodeGlob.default(pattern, (err, matches) => {
            if (err) {
                reject(err);
            }
            resolve(matches);
        });
    });
};

