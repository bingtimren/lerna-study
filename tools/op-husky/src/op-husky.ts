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
    opCmd.chalkedExecaSync("husky", ["install", HUSKYDIR]);
    const configSetting: configs =
      opCmd.getConfigFileContentParsed() as configs;
    for (const [hook, actions] of Object.entries(configSetting)) {
      for (const action of typeof actions === "string" ? [actions] : actions) {
        console.log(
          chalk.blueBright(`Adding git hook [${hook}] action: `) + action
        );
        opCmd.chalkedExecaSync("husky", ["add", join(HUSKYDIR, hook), action]);
      }
    }
  });

opCmd.parse(process.argv);
