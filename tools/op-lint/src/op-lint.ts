#!/usr/bin/env node
import { OpinionedCommand, chalkedExecSync } from "@bingsjs/op-tools";
import { join } from "path";

function lintFix(opCmd: OpinionedCommand, fix: boolean, globs: string[]) {
  const joinedGlobs = globs.map((g) => `"${g}"`).join(" ");
  const CMD = `${opCmd.opts.exe} eslint --no-error-on-unmatched-pattern -c ${
    opCmd.configFilePath
  } ${fix ? "--fix" : ""} ${joinedGlobs}`;
  chalkedExecSync(CMD);
}

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});
opCmd.program
  .command("lint <globs...>", { isDefault: true })
  .description("(default command) lint the files")
  .action(lintFix.bind(undefined, opCmd, false));
opCmd.program
  .command("fix <globs...>")
  .description("lint and fix the files")
  .action(lintFix.bind(undefined, opCmd, true));
opCmd.parse();
