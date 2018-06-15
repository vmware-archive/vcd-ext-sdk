const fs = require('fs-extra');

const distFolder = `${__dirname}/dist`
if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder);
}

fs.copySync(`${__dirname}/lib`, distFolder);
fs.copySync(`${__dirname}/package.dist.json`, `${distFolder}/package.json`);