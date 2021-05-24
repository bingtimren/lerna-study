#!/usr/bin/env node

import { join, dirname } from "path";
import { OpinionedCommand } from "@bingsjs/op-tools";
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap; // eslint-disable-line

const opCmd = new OpinionedCommand(join(__dirname, ".."));
opCmd.program
  .command("commit", { isDefault: true })
  .description("commit with Commitizen")
  .action(() => {
    bootstrap({
      cliPath: dirname(require.resolve("commitizen/package.json")),
      config: opCmd.getConfigFileContentParsed(),
    });
  });
opCmd.program
  .command("hook <p1> <p2> <p3>")
  .description("run as git prepare-commit-msg hook")
  .action((p1: string, p2: string, p3: string) => {
    bootstrap(
      {
        cliPath: dirname(require.resolve("commitizen/package.json")),
        config: opCmd.getConfigFileContentParsed(),
      },
      ["git", "cz", "--hook", p1, p2, p3]
    );
  });

opCmd.parse(process.argv);
