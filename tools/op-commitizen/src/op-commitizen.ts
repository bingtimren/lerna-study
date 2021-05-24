#!/usr/bin/env node

import { join, dirname } from "path";
import { OpinionedCommand } from "@bingsjs/op-tools";
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap; // eslint-disable-line

const opCmd = new OpinionedCommand(join(__dirname, ".."));
opCmd.program.option("--hook", "run as git prepare-commit-msg");
opCmd.program
  .command("commit", { isDefault: true })
  .description("commit with Commitizen")
  .action(() => {
    bootstrap(
      {
        cliPath: dirname(require.resolve("commitizen/package.json")),
        config: opCmd.getConfigFileContentParsed(),
      },
      opCmd.opts.hook ? ["--hook"] : undefined
    );
  });

opCmd.parse(process.argv);
