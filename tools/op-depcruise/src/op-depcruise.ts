#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join, dirname } from "path";
import { mkdirSync } from "fs";

const OUTPUT = "docs/api/dependency-graph.svg";

const rsbin = require("@bingsjs/resolve-bin"); // eslint-disable-line

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});
// opCmd.localCopyConfig("op-tscdoc.tsconfig.json");
opCmd.program
  .command("build", { isDefault: true })
  .description(
    "(default command) build dependency graph with dependency-cruiser"
  )
  .option("-o, --open", "open the generated graph")
  .action(async (options) => {
    opCmd.localCopyConfig("dependency-cruiser.js");
    const depcruisePath = rsbin.sync("dependency-cruiser", {
      executable: "depcruise",
    });
    mkdirSync(dirname(OUTPUT), { recursive: true });
    const srcDirPattern = /CLI-OPTION\s*:\s*srcDir\s*=\s*"(.+)"/;
    const srcDirMatch = opCmd
      .getConfigFileContent()
      .toString()
      .match(srcDirPattern);
    const srcDir = srcDirMatch ? srcDirMatch[1] : ".";
    opCmd.getConfigFileContent().toString();
    const CMD = `${depcruisePath} --config ${opCmd.configFilePathCopiedLocal} --output-type dot ${srcDir} | dot -T svg > ${OUTPUT}`;
    opCmd.chalkedExecSync(CMD, true);
    // open the document if asked
    if (options.open) {
      await opCmd.chalkedForkPackageBin("open-cli", undefined, [OUTPUT]);
    }
  });

opCmd.parse(process.argv);
