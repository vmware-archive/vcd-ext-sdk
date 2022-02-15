const fs = require('fs');
const path = require('path');

const ignoredFolders = ['.github', '.gradle', '.idea', '.git', 'node_modules', 'lib', 'src', 'tests'];
const generatedFileName = 'provenance.json';
const projectName = 'vcd-ext-sdk/';

function extractDependencies(currentDir, components) {
    try {
        const files = fs.readdirSync(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            if (file === 'package-lock.json') {
                const packageLockJson = readAndParseFile(filePath);
                const packageJsonPath = filePath.replace('package-lock.json', 'package.json');
                const packageJson = readAndParseFile(packageJsonPath);
                addDependencies(packageLockJson, packageJson.version, components, currentDir);
            } else {
                // Stat the file to see if we have a file or dir
                const stat = fs.statSync(filePath);

                if (stat.isDirectory() && !ignoredFolders.includes(file)) {
                    extractDependencies(filePath, components);
                }
            }
        }
    } catch (e) {
        console.error("Could not generate dependencies for project.", e);
    }
}

function readAndParseFile(filePath) {
    const fileContent = fs.readFileSync(filePath);
    return JSON.parse(fileContent);
}

function addDependencies(packageLockJson, version, components, dir) {
    const component = {
        directory: dir,
        version: version,
        dependencies: []
    };

    extract(packageLockJson.dependencies, component);

    components[packageLockJson.name] = component;
}

function extract(dependencies, component) {
    if (!dependencies) {
        return;
    }

    for (const [key, value] of Object.entries(dependencies)) {
        const resolvedUrl = new URL(value.resolved);
        const host = resolvedUrl.host;
        const path = resolvedUrl.pathname;
        const version = value.version;

        component.dependencies.push({
            host: host,
            path: path,
            version: version,
            name: key
        });
    }
}

function generateResult(name, version, currentDir) {
    const dir = currentDir.substr(currentDir.lastIndexOf(projectName) + projectName.length);
    return {
        id: 'http://vmware.com/schemas/software_provenance-0.2.5.json',
        root: version,
        tools: "https://github.com/: null",
        'all-components': {
            name: name,
            version: version,
            'source_repositories': [
                {
                    content: "source",
                    host: "github.com",
                    protocol: "git",
                    paths: [
                        "/vmware/vcd-ext-sdk/tree/main/" + dir
                    ],
                    branch: 'main'
                },
            ],
            components: {},
            'artifact_repositories': []
        }
    };
}

function writeFile(dir, result) {
    const path = dir + '/' + generatedFileName;
    // delete the generated file if exists
    if (fs.existsSync(path)) {
        const existingFile = readAndParseFile(path);
        // if versions are the same, no need to generate the file
        if (existingFile.root === result.root) {
            return;
        }

        fs.unlinkSync(path);
    }

    // create the file
    const writeStream = fs.createWriteStream(path);
    writeStream.write(JSON.stringify(result, null, 2));
    writeStream.close();
}

(() => {
    // first we scan all package-lock.json files to get the dependencies
    const components = [];
    extractDependencies(__dirname.substr(0, __dirname.indexOf('.github/workflows')), components);

    for (const [key, value] of Object.entries(components)) {
        const dir = value.directory;
        const provenanceFile = generateResult(key, value.version, dir);
        const artifactRepos = provenanceFile['all-components']['artifact_repositories'];
        value.dependencies.forEach(dependency => {
            artifactRepos.push({
                content: 'binary',
                protocol: 'HTTPS',
                host: dependency.host,
                path: dependency.path
            })
        });
        writeFile(dir, provenanceFile);
    }
})();

