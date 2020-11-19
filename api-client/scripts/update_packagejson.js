const fs = require('fs');
const path = require('path');

const packagejsonPath = path.join(__dirname, '../dist/vcd/sdk/package.json')
const packagejsonPathRaw = fs.readFileSync(packagejsonPath, 'utf-8')
const packageJson = JSON.parse(packagejsonPathRaw);

packageJson.module = "esm5/vcd-sdk.js";

fs.writeFileSync(packagejsonPath, JSON.stringify(packageJson, null, 4))