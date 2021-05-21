#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import { readFileSync } from "fs";
import load from "@commitlint/load";
import lint from "@commitlint/lint";
import * as chalk from "chalk";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});

opCmd.program
  .command("lint <messageFile>", { isDefault: true })
  .description("(default command) lint the commit message with -e")
  .action(async (messageFile: string) => {
    const config = opCmd.getConfigFileContentParsed();
    const message = readFileSync(messageFile).toString();
    const opts = await load(config as any);
    const lintResult = await lint(
      message,
      opts.rules,
      opts.parserPreset
        ? { parserOpts: opts.parserPreset.parserOpts as any }
        : {}
    );
    if (lintResult.errors && lintResult.errors.length > 1) {
      lintResult.errors.forEach((err) => {
        console.log(
          chalk.redBright(`Git message error: ${err.name} - `) + err.message
        );
      });
      process.exit(1);
    }
  });
opCmd.parse(process.argv);
