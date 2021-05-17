/**
 * Base class of opinioned tools
 */

import * as commander from "commander";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import * as childProcess from "child_process";
import { parse as jsoncParse } from "jsonc-parser";

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

export class OpinionedCommand {
  private prog: commander.Command;
  private dirOptions: OpinionedCommandOptions;
  private localConfigPath: string | undefined;
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
        console.log(this.getConfigFileContent().toString());
      });
  }

  public get program(): commander.Command {
    return this.prog;
  }
  public get configDir(): string {
    return path.join(this.baseDir, this.dirOptions.configFilesRelativeDir);
  }
  public get configFilePath(): string {
    return this.localConfigPath
      ? this.localConfigPath
      : this.configFilePathInPackage;
  }
  public get configFilePathInPackage(): string {
    return path.join(
      this.configDir,
      `${this.opts.preConfig}${this.dirOptions.configFileSuffix}`
    );
  }
  public get configFilePathCopiedLocal(): string | undefined {
    return this.localConfigPath;
  }
  public getConfigFileContent(): Buffer {
    return fs.readFileSync(this.configFilePath);
  }
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public getConfigFileContentParsed(): any {
    if (this.configFilePath.endsWith(".jsonc")) {
      return jsoncParse(this.getConfigFileContent().toString());
    } else if (this.configFilePath.endsWith(".json")) {
      return JSON.parse(this.getConfigFileContent().toString());
    } else if (this.configFilePath.endsWith(".js")) {
      const absPath = path.isAbsolute(this.configFilePath)
        ? this.configFilePath
        : path.join(process.cwd(), this.configFilePath);
      return require(absPath);
    }
    throw new Error(`Cannot parse ${this.configFilePath}, unknown file type.`);
  }
  public get opts(): commander.OptionValues {
    return this.prog.opts();
  }
  public async parse(argv?: string[]): Promise<void> {
    this.prog.parseAsync(argv ? argv : process.argv);
  }
  public localCopyConfig(fname: string, dirName = ".opToolsConfig"): void {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    if (!fs.statSync(dirName).isDirectory()) {
      throw new Error(`${dirName} is not a directory`);
    }
    const localConfigPath = path.join(dirName, fname);
    fs.copyFileSync(this.configFilePathInPackage, localConfigPath);
    this.localConfigPath = localConfigPath;
  }
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public chalkedExecSync(CMD: string, exitOnError = true): any {
    if (this.opts.verbose) {
      console.log(chalk.cyanBright("Running command: ") + CMD);
    }
    try {
      childProcess.execSync(CMD, { stdio: "inherit" });
    } catch (err) {
      console.error(chalk.redBright("ERROR: command failed: ") + CMD);
      if (exitOnError) {
        process.exit(err.status);
      } else {
        return err;
      }
    }
  }
}
