#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import { build } from "tsc-prog";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".tsconfig.jsonc",
});

opCmd.program
  .command("build", { isDefault: true })
  .description("run tsc --build")
  .action(() => {
    const config = opCmd.getConfigFileContentParsed();
    const buildConfig = {
      basePath: process.cwd(),
      compilerOptions: config.compilerOptions,
      include: config.include,
      exclude: config.exclude,
    };
    console.log(buildConfig);
    build(buildConfig);
  });
opCmd.parse();
