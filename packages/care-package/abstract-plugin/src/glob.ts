import * as path from 'path';
import fs from 'fs';
import minimatch from 'minimatch';
import debug from 'debug';
const log = debug('vcd:ext:glob');

/**
 * Searches for files by glob pattern recursively
 * @param root - root path
 * @param directory - current directory
 * @param pattern - a glob search pattern
 */
const globReq = (root: string, directory: string, pattern: string): string[] => {
    let filepaths = [];
    const files = fs.readdirSync(directory);
    for (const filename of files) {
        const filepath = path.join(directory, filename);
        const isDirectory = fs.statSync(filepath).isDirectory();
        const doesMatch = !isDirectory && minimatch(path.relative(root, filepath), pattern, {matchBase: true});
        log(`${filepath}: isDirectory: ${isDirectory}; doesMatch: ${doesMatch}`);
        if (isDirectory) {
            filepaths = filepaths.concat(globReq(root, filepath, pattern));
        } else if (doesMatch) {
            filepaths.push(filepath);
        }
    }
    return filepaths;
};

/**
 * Searches for files by glob pattern recursively
 * @param directory - root path
 * @param pattern - a glob search pattern
 */
export const glob = (directory: string, pattern: string): string[] => {
    return globReq(directory, directory, pattern);
};
