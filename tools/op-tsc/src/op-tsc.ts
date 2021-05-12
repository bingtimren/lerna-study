#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import { build } from "tsc-prog";
import { cleanAllFiles } from "ts-purify";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".tsconfig.jsonc",
});

opCmd.program
  .command("build", { isDefault: true })
  .description("run tsc --build")
  .action(async () => {
    const config = opCmd.getConfigFileContentParsed();
    // first do purify
    try {
      await cleanAllFiles(
        config.compilerOptions.rootDir,
        config.compilerOptions.outDir
      );
    } catch (err) {
      console.log("WARNING: ts-purify failed. Maybe 'outDir' does not exist?");
    }

    const buildConfig = {
      basePath: process.cwd(),
      compilerOptions: config.compilerOptions,
      include: config.include,
      exclude: config.exclude,
    };
    build(buildConfig);
  });
opCmd.parse();
