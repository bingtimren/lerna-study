#!/usr/bin/env node
'use strict';

const path = require('path');
const childProcess = require('child_process');
const { inherits } = require('util');
const args = process.argv.slice(2).join(" ") || "**/*.ts"
const configFile = path.join(__dirname, ".eslintrc.js");
const CMD = `yarn eslint --no-error-on-unmatched-pattern -c ${configFile} ${args}`
try {
    childProcess.execSync(CMD, {
        stdio:"inherit"
    })
} catch (err) {
    console.error(`Error: Command failed: ${CMD}`)
    process.exit(err.status)
}
