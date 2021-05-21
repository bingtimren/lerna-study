#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});

opCmd.program
  .command("lint", { isDefault: true })
  .description("(default command) lint the commit message with -e")
  .action(() => {
    const CMD = `${opCmd.opts.exe} commitlint --config ${opCmd.configFilePath} --edit`;
    opCmd.chalkedExecSync(CMD);
  });
opCmd.parse(process.argv);
