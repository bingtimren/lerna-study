#!/usr/bin/env node
import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";

const opCmd = new OpinionedCommand(join(__dirname, ".."), {
  configFileSuffix: ".js",
});
opCmd.program.option(
  "-o, --onlyChanged",
  "run based on file changes (in a git repo)"
);
opCmd.program.option("-w, --watch", "watch file change and run related tests");
opCmd.program.option("--coverage", "collect and enforce coverage");
opCmd.program.option("-r, --report", "open coverage report");
opCmd.program.option("-d, --debug", "run in debug mode");
opCmd.program
  .command("test", { isDefault: true })
  .description("(default command) run jest")
  .action(() => {
    opCmd.localCopyConfig(".op-jest.config.js");
    const CMD =
      `${opCmd.opts.exe} jest -c ${opCmd.configFilePathCopiedLocal} ` +
      `${opCmd.opts.onlyChanged ? "--onlyChanged" : ""} ` +
      `${opCmd.opts.debug ? "--runInBand " : ""}` +
      `${opCmd.opts.watch ? "--watchAll" : ""}` +
      `${opCmd.opts.coverage ? "--coverage" : ""}`;
    const toReport =
      opCmd.opts.coverage &&
      opCmd.opts.report &&
      (opCmd.getConfigFileContentParsed() as any).coverageDirectory;
    const jestResult = opCmd.chalkedExecSync(CMD, false);
    if (toReport) {
      const rptPath = join(
        (opCmd.getConfigFileContentParsed() as any).coverageDirectory,
        "lcov-report/index.html"
      );
      opCmd.chalkedExecSync(`yarn open-cli ${rptPath}`);
    }
    if (jestResult?.status) {
      process.exit(jestResult.status);
    }
  });
opCmd.parse(process.argv);
