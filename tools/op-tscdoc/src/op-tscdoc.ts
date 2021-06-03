#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join, dirname } from "path";
import { cleanAllFiles } from "ts-purify";
import { yellowBright } from "chalk";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".tsconfig.json",
});

opCmd.program
  .command("build", { isDefault: true })
  .option("--no-purify", "do not run ts-purify before compiling")
  .description("run tsc --build")
  .action(async (options) => {
    opCmd.localCopyConfig("op-tscdoc.tsconfig.json");
    if (options.purify) {
      // first do purify - remove extraneous .js from outDir that has no corresponding .ts in rootDir
      const config = opCmd.getConfigFileContentParsed() as {
        compilerOptions?: {
          rootDir?: string;
          outDir?: string;
        };
      };
      try {
        if (
          config?.compilerOptions?.rootDir &&
          config?.compilerOptions?.outDir
        ) {
          await cleanAllFiles(
            // ts-purify resolves dir from current dir, tsdoc resolves from where the config file locates, so need
            // to resolve the differences
            join(
              dirname(opCmd.configFilePathCopiedLocal!),
              config.compilerOptions.rootDir
            ),
            join(
              dirname(opCmd.configFilePathCopiedLocal!),
              config.compilerOptions.outDir
            )
          );
        }
      } catch (err) {
        console.log(
          yellowBright(
            "WARNING: ts-purify failed. Maybe 'outDir' does not exist?"
          )
        );
      }
    }

    // do tsc --build

    opCmd.chalkedExecaSync("tsc", [
      "--build",
      opCmd.configFilePathCopiedLocal!,
    ]);
  });

opCmd.program
  .command("doc")
  .description("build document with typedoc")
  .option("-o, --open", "open the generated API document")
  .action(async (options) => {
    opCmd.localCopyConfig("op-tscdoc.tsconfig.json");
    // do typedoc --tsconfig
    opCmd.chalkedExecaSync("typedoc", [
      "--tsconfig",
      opCmd.configFilePathCopiedLocal!,
    ]);
    // open the document if asked
    if (options.open) {
      await opCmd.chalkedExecaSync("open-cli", ["docs/api/index.html"]);
    }
  });

opCmd.parse(process.argv);
