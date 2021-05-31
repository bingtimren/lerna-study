#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import { cleanAllFiles } from "ts-purify";
import { yellowBright } from "chalk";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".tsconfig.json",
});

opCmd.program
  .command("build", { isDefault: true })
  .description("run tsc --build")
  .action(async () => {
    opCmd.localCopyConfig("op-tscdoc.tsconfig.json");

    // first do purify - remove extraneous .js from outDir that has no corresponding .ts in rootDir
    const config = opCmd.getConfigFileContentParsed() as {
      compilerOptions?: {
        rootDir?: string;
        outDir?: string;
      };
    };
    try {
      if (config?.compilerOptions?.rootDir && config?.compilerOptions?.outDir) {
        await cleanAllFiles(
          config.compilerOptions.rootDir,
          config.compilerOptions.outDir
        );
      }
    } catch (err) {
      console.log(
        yellowBright(
          "WARNING: ts-purify failed. Maybe 'outDir' does not exist?"
        )
      );
    }

    // do tsc --build

    opCmd.chalkedForkPackageBin(
      "typescript",
      "tsc",
      ["--build", opCmd.configFilePathCopiedLocal!],
      true
    );
  });
opCmd.parse(process.argv);
