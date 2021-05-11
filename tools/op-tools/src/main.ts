/**
 * Base class of opinioned tools
 */

import commander from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export class OpinionedCommand {
  private prog: commander.Command;
  constructor(
    private baseDir: string,
    private configFilesRelativeDir: string = "pre-configs",
    private configFileSuffix: string = ".json",
    private defaultConfig: string = "default"
  ) {
    this.prog = new commander.Command();
    this.prog
      .option("-c, --pre-config <config>", "choose a pre-config", "default")
      .option("-v, --verbose", "verbose mode, output more information")
      .option(
        "-x, --exe <executor>",
        "choose an executor, 'npx' or 'yarn'",
        "yarn"
      );
    this.prog
      .command("list")
      .description("list available pre-configs and exit")
      .action(() => {
        if (this.opts.verbose) {
          console.log(
            chalk.blueBright("Pre-configuration file dir: ") + this.configDir
          );
        }
        fs.readdirSync(this.configDir)
          .map((fname) =>
            fname.substr(0, fname.length - this.configFileSuffix.length)
          )
          .forEach((conf) => {
            console.log(conf);
          });
        process.exit(0);
      });
    this.prog
      .command("print")
      .description("print content of the pre-config and exit")
      .action(() => {
        if (this.opts.verbose) {
          console.log(chalk.blueBright("Pre-config: ") + this.opts.preConfig);
          console.log(
            chalk.blueBright("Pre-config File: ") + this.configFilePath
          );
        }
        console.log(fs.readFileSync(this.configFilePath).toString());
      });
  }

  public get program(): commander.Command {
    return this.prog;
  }
  public get configDir(): string {
    return path.join(this.baseDir, this.configFilesRelativeDir);
  }
  public get configFilePath(): string {
    return path.join(
      this.configDir,
      `${this.opts.preConfig}${this.configFileSuffix}`
    );
  }
  public get opts(): commander.OptionValues {
    return this.prog.opts();
  }
  public parse(argv?: string[]): void {
    this.prog.parse(argv ? argv : process.argv);
  }
}
