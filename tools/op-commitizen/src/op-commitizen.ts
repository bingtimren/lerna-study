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
  .command("hook <messageFileName> <sourceOfMessage> [p3]") // see https://git-scm.com/docs/githooks#_prepare_commit_msg
  .description(
    "run as git prepare-commit-msg hook, see https://git-scm.com/docs/githooks#_prepare_commit_msg"
  )
  .action((messageFileName: string, sourceOfMessage: string, p3: string) => {
    console.log(
      `COMMITIZEN AS HOOK: !!${messageFileName}!! !!${sourceOfMessage}!! !!${p3}!!!`
    );
    // if a message is provided with -m, skip commitizen, as git commit may be invoked in a script
    if (sourceOfMessage === "message") {
      process.exit(0);
    }
    bootstrap(
      {
        cliPath: dirname(require.resolve("commitizen/package.json")),
        config: opCmd.getConfigFileContentParsed(),
      },
      ["git", "cz", "--hook", messageFileName, sourceOfMessage, p3]
    );
  });

opCmd.parse(process.argv);
