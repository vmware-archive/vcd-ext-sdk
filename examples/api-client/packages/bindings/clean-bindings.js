const fs = require('fs-extra');

if (fs.existsSync(`${__dirname}/lib`)) {
    fs.removeSync(`${__dirname}/lib`);
}

if (fs.existsSync(`${__dirname}/dist`)) {
    fs.removeSync(`${__dirname}/dist`);
}