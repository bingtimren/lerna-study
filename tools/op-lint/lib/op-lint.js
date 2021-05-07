#!/usr/bin/env node

console.log(`ARGV: ${process.argv}`);

const path = require("path");
const childProcess = require("child_process");
const { program } = require("commander");
const fs = require("fs");

const configsDir = path.join(__dirname, "eslint-configs");
function list() {
  return fs.readdirSync(configsDir).map((fname) => fname.split(".")[0]);
}

// process arguments
program
  .usage("[options] globs...")
  .option(
    "-c, --pre-config <config>",
    'choose a pre-config, default to "typescript"',
    "typescript"
  )
  .option("-l, --list", "list a pre-config and exit")
  .option("-f, --fix", "automatically fix problems");

program.parse(process.argv);

const options = program.opts();

// handle list command and exit
if (options.list) {
  list().forEach((preConf) => console.log(preConf));
  process.exit(0);
}

// do linting
// check dirs
if (program.args.length === 0) {
  console.error("Error: Missing globs");
  process.exit(1);
}

// check pre-config
const configFile = path.join(configsDir, `${options.preConfig}.js`);
try {
  fs.accessSync(configFile, fs.constants.R_OK);
} catch (err) {
  console.error(`Error: pre-config file ${configFile} is not accessible`);
  process.exit(1);
}

// prepare command
const CMD = `yarn eslint ${
  options.fix ? "--fix" : ""
} --no-error-on-unmatched-pattern -c ${configFile} ${program.args
  .map((x) => `"${x}"`)
  .join(" ")}`;
try {
  childProcess.execSync(CMD, {
    stdio: "inherit",
  });
} catch (err) {
  console.error(`Error: Command failed: ${CMD}`);
  process.exit(err.status);
}
