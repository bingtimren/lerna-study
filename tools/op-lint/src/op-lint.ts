#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";

function lintFix(opCmd: OpinionedCommand, fix: boolean, globs: string[]): void {
  const argv = ["--no-error-on-unmatched-pattern", "-c", opCmd.configFilePath];
  if (fix) {
    argv.push("--fix");
  }
  argv.push(...globs);
  opCmd.chalkedExecaSync("eslint", argv, true);
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
opCmd.parse(process.argv);
