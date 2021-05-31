#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";
import { mkdirSync } from "fs";
import { cruise, IReporterOutput, ICruiseOptions } from "dependency-cruiser";
import { renderGraphFromSource } from "graphviz-cli";

const OUTPUT_FILENAME = "dependency-graph.svg";
const OUTPUT_DIR = "docs/api";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});

opCmd.program
  .command("build", { isDefault: true })
  .description(
    "(default command) build dependency graph with dependency-cruiser"
  )
  .option("-o, --open", "open the generated graph")
  .action(async (options: { open?: boolean }) => {
    // config
    const cruiseOptions: ICruiseOptions =
      opCmd.getConfigFileContentParsed() as ICruiseOptions;
    cruiseOptions.outputType = "dot";

    // cruise and get dot content
    const cruiseResult: IReporterOutput = cruise(["."], cruiseOptions);

    // output svg
    const outFilePath = join(OUTPUT_DIR, OUTPUT_FILENAME);

    // generate svg
    mkdirSync(OUTPUT_DIR, { recursive: true });
    await renderGraphFromSource(
      { input: cruiseResult.output as string },
      {
        format: "svg",
        name: outFilePath,
      }
    );

    // open the document if asked
    if (options.open) {
      await opCmd.chalkedForkPackageBin("open-cli", undefined, [outFilePath]);
    }
  });

opCmd.parse(process.argv);
