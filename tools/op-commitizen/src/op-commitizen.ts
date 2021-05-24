#!/usr/bin/env node

import { join, dirname } from "path";
import { OpinionedCommand } from "@bingsjs/op-tools";
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap; // eslint-disable-line

const opCmd = new OpinionedCommand(join(__dirname, ".."));
opCmd.program
  .command("commit")
  .description("commit with Commitizen")
  .action(() => {
    bootstrap({
      cliPath: dirname(require.resolve("commitizen/package.json")),
      config: opCmd.getConfigFileContentParsed(),
    });
  });

opCmd.parse(process.argv);
