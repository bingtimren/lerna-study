#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
const lintStaged = require('lint-staged'); // eslint-disable-line

const opCmd = new OpinionedCommand(join(__dirname, ".."));
opCmd.program
  .command("run", { isDefault: true })
  .description("(default command) run lint-staged")
  .action(async () => {
    const success = await lintStaged({
      allowEmpty: false,
      concurrent: true,
      configPath: opCmd.getConfigFileContentParsed(),
      cwd: process.cwd(),
      debug: false,
      maxArgLength: null,
      quiet: false,
      relative: false,
      shell: false,
      stash: true,
      verbose: false,
    });
    if (!success) {
      console.error("lint-staged failed");
      process.exit(1);
    }
  });
