#!/usr/bin/env node

import { OpinionedCommand } from "@bingsjs/op-tools";
import { join, dirname } from "path";
import { mkdirSync } from "fs";
import { cruise, IReporterOutput, ICruiseOptions } from "dependency-cruiser";
import { renderGraphFromSource } from "graphviz-cli";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});

opCmd.program
  .command("build", { isDefault: true })
  .description(
    "(default command) build dependency graph with dependency-cruiser"
  )
  .option("-o, --open", "open the generated graph")
  .option("-s, --save <path>", "save to path", "docs/api/dependency-graph.svg")
  .action(async (options: { open?: boolean; save: string }) => {
    // config
    const cruiseOptions: ICruiseOptions =
      opCmd.getConfigFileContentParsed() as ICruiseOptions;
    cruiseOptions.outputType = "dot";

    // cruise and get dot content
    const cruiseResult: IReporterOutput = cruise(["."], cruiseOptions);

    // output svg
    const outFilePath = options.save;
    console.log(options);
    // generate svg
    mkdirSync(dirname(outFilePath), { recursive: true });
    await renderGraphFromSource(
      { input: cruiseResult.output as string },
      {
        format: "svg",
        name: outFilePath,
      }
    );

    // open the document if asked
    if (options.open) {
      opCmd.chalkedExecaSync("open-cli", [outFilePath]);
    }
  });

opCmd.parse(process.argv);
