#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import childProcess from "child_process";
import chalk from "chalk";

function lintFix(opCmd: OpinionedCommand, fix: boolean, globs: string[]) {
  const joinedGlobs = globs.map((g) => `"${g}"`).join(" ");
  const CMD = `${opCmd.opts.exe} eslint --no-error-on-unmatched-pattern -c ${
    opCmd.configFilePath
  } ${fix ? "--fix" : ""} ${joinedGlobs}`;
  try {
    childProcess.execSync(CMD, { stdio: "inherit" });
  } catch (err) {
    console.error(chalk.redBright("ERROR: command failed: ") + CMD);
    process.exit(err.status);
  }
}

const opCmd = new OpinionedCommand(
  join(__dirname, ".."),
  "pre-configs",
  ".js",
  "default"
);
opCmd.program
  .command("lint <globs...>", { isDefault: true })
  .description("(default command) lint the files")
  .action(lintFix.bind(undefined, opCmd, false));
opCmd.program
  .command("fix <globs...>")
  .description("lint and fix the files")
  .action(lintFix.bind(undefined, opCmd, true));
opCmd.parse();
