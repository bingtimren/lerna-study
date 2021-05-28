#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import * as chalk from "chalk";

interface configs {
  [hookName: string]: string | string[];
}

const HUSKYDIR = ".husky";

const opCmd = new OpinionedCommand(join(__dirname, ".."));
opCmd.program
  .command("install", { isDefault: true })
  .description("(default command) install husky and the git hooks")
  .action(() => {
    console.log(chalk.blueBright("Installing husky"));
    opCmd.chalkedForkPackageBin("husky", undefined, ["install", HUSKYDIR]);
    const configSetting: configs =
      opCmd.getConfigFileContentParsed() as configs;
    Object.entries(configSetting).forEach(([hook, actions]) => {
      (typeof actions === "string" ? [actions] : actions).forEach((action) => {
        console.log(
          chalk.blueBright(`Adding git hook [${hook}] action: `) + action
        );
        opCmd.chalkedForkPackageBin("husky", undefined, [
          "add",
          join(HUSKYDIR, hook),
          action,
        ]);
      });
    });
  });

opCmd.parse(process.argv);
