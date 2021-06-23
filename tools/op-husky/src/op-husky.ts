#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import { statSync } from "fs";
import * as chalk from "chalk";

interface configs {
  [hookName: string]: string | string[];
}

const GITDIR = ".git";
const HUSKYDIR = ".husky";
const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".jsonc",
});

opCmd.program
  .command("install", { isDefault: false })
  .description("install the pre-configured git hooks with husky")
  .option(
    "--find-git-dir",
    "find the .git dir, from the current dir, then the parent directory and so on. Useful when called in a lifecycle script (e.g. 'postinstall') of a tool-set package."
  )
  .action((opts) => {
    const originalCwd = process.cwd();
    let curDir = originalCwd;
    // find .git dir
    if (opts.findGitDir) {
      /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
      while (true) {
        try {
          if (statSync(join(curDir, GITDIR)).isDirectory()) {
            break;
          }
        } catch (error) {
          /* go up */
        }
        // go up
        const parent = join(curDir, "..");
        if (parent === curDir) {
          process.chdir(originalCwd);
          console.log(
            chalk.redBright(
              "ERROR: cannot find repository root that contains .git dir"
            )
          );
          process.exit(1);
        }
        curDir = parent;
      }
      process.chdir(curDir);
    }
    // verify .git dir
    try {
      if (!statSync(join(process.cwd(), GITDIR)).isDirectory())
        throw new Error(`.git is not directory?`);
    } catch (error) {
      process.chdir(originalCwd);
      console.log(
        chalk.redBright(
          `ERROR: cannot find .git dir under ${curDir}: ${error.message}`
        )
      );
      process.exit(1);
    }
    // install
    console.log(chalk.blueBright(`Installing husky (dir=${process.cwd()})`));
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
    process.chdir(originalCwd);
  });

opCmd.parse(process.argv);
