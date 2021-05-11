/**
 * Base class of opinioned tools
 */

import commander from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import childProcess from "child_process";

interface OpinionedCommandOptions {
  configFilesRelativeDir: string;
  configFileSuffix: string;
  defaultConfig: string;
}

const defaultOptions: OpinionedCommandOptions = {
  configFileSuffix: ".json",
  configFilesRelativeDir: "pre-configs",
  defaultConfig: "default",
};

export function chalkedExecSync(CMD: string): void {
  try {
    childProcess.execSync(CMD, { stdio: "inherit" });
  } catch (err) {
    console.error(chalk.redBright("ERROR: command failed: ") + CMD);
    process.exit(err.status);
  }
}

export class OpinionedCommand {
  private prog: commander.Command;
  private dirOptions: OpinionedCommandOptions;
  constructor(
    private baseDir: string,
    options: Partial<OpinionedCommandOptions> = {}
  ) {
    this.dirOptions = Object.assign(defaultOptions, options);
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
            fname.substr(
              0,
              fname.length - this.dirOptions.configFileSuffix.length
            )
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
    return path.join(this.baseDir, this.dirOptions.configFilesRelativeDir);
  }
  public get configFilePath(): string {
    return path.join(
      this.configDir,
      `${this.opts.preConfig}${this.dirOptions.configFileSuffix}`
    );
  }
  public get opts(): commander.OptionValues {
    return this.prog.opts();
  }
  public parse(argv?: string[]): void {
    this.prog.parse(argv ? argv : process.argv);
  }
}
