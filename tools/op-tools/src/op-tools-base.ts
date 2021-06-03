/**
 * Base class of opinioned tools
 */

import * as commander from "commander";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import { parse as jsoncParse } from "jsonc-parser";
import * as execa from "execa";

/**
 * Options for initiating an OpinionedCommand instance
 */
interface OpinionedCommandOptions {
  configFilesRelativeDir: string;
  configFileSuffix: string;
  defaultConfig: string;
  localCopyDir: string;
}

export const defaultOptions: OpinionedCommandOptions = {
  configFileSuffix: ".json",
  configFilesRelativeDir: "pre-configs",
  defaultConfig: "default",
  localCopyDir: ".opToolsConfig",
};

/**
 * OpinionedCommand
 * This class contains common functionality for implementing "opinioned tools", i.e. tools  (eslint, jest, tsc, etc.) with
 * pre-configurations and additional packages (plug-ins etc).
 */
export class OpinionedCommand {
  private prog: commander.Command;
  private dirOptions: OpinionedCommandOptions;
  private localConfigPath: string | undefined;
  /**
   *
   * @param baseDir the base dir of the "opinioned tools" package, used to resolve pre-configuration files, usually the "__dirname" from the calling script
   * @param options optional options:
   *    - configFileSuffix: default to ".json",
   *    - configFilesRelativeDir: the folder containing the config files, relative to the baseDir, default to "pre-configs",
   *    - defaultConfig: the base name of the default config file, default to "default",
   *    - localCopyDir: default to ".opToolsConfig", the relative dir if {@link localCopyConfig} is called
   */
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
          .filter((fname) => fname.endsWith(this.dirOptions.configFileSuffix))
          .map((fname) =>
            fname.substr(
              0,
              fname.length - this.dirOptions.configFileSuffix.length
            )
          )
          .forEach((conf) => {
            console.log(conf);
          });
      });
    this.prog
      .command("print")
      .description("print content of the pre-config and exit")
      .action(() => {
        if (this.opts.verbose) {
          console.log(chalk.blueBright("Pre-config: ") + this.opts.preConfig);
          console.log(
            chalk.blueBright("Pre-config File: ") + this.configFilePathInPackage
          );
        }
        console.log(fs.readFileSync(this.configFilePathInPackage).toString());
      });
  }

  /**
   * The Commander "program" object, see https://github.com/tj/commander.js/
   */
  public get program(): commander.Command {
    return this.prog;
  }
  /**
   * The dir in the opinioned tools package that contains the pre-configuration files
   */
  public get configDir(): string {
    return path.join(this.baseDir, this.dirOptions.configFilesRelativeDir);
  }
  /**
   * The selected pre-configuration file's path. This is either:
   * - the relative path of the locally copied configuration file, if {@link localCopyConfig} is called, or
   * - the absolute path of the pre-configuration file in the opinioned tool package, i.e. baseDir + configFilesRelativeDir + selectedConfig + configFileSuffix
   */
  public get configFilePath(): string {
    return this.localConfigPath
      ? this.localConfigPath
      : this.configFilePathInPackage;
  }
  /**
   * path of the selected pre-configuration file in the opinioned tools package (relative to baseDir)
   */
  public get configFilePathInPackage(): string {
    return path.join(
      this.configDir,
      `${this.opts.preConfig}${this.dirOptions.configFileSuffix}`
    );
  }
  /**
   * if {@link localCopyConfig} is called, path relative to current dir, of the copied configuration file,
   * otherwise 'undefined'
   */
  public get configFilePathCopiedLocal(): string | undefined {
    return this.localConfigPath;
  }
  /**
   * the options passed to constructor
   */
  public get constructOptions(): OpinionedCommandOptions {
    return this.dirOptions;
  }
  /**
   *
   * @returns the content of the configuration file as a Buffer object
   */
  public getConfigFileContent(): Buffer {
    return fs.readFileSync(this.configFilePath);
  }
  /**
   *
   * @returns the content of the configuration file, parsed to javascript object according to suffix (.json, .jsonc, .js)
   */
  public getConfigFileContentParsed(): unknown {
    if (
      this.configFilePath.endsWith(".jsonc") ||
      this.configFilePath.endsWith(".json")
    ) {
      return jsoncParse(this.getConfigFileContent().toString());
    } else if (this.configFilePath.endsWith(".js")) {
      const absPath = path.isAbsolute(this.configFilePath)
        ? this.configFilePath
        : path.join(process.cwd(), this.configFilePath);
      return require(absPath);
    }
    throw new Error(`Cannot parse ${this.configFilePath}, unknown file type.`);
  }
  /**
   * the command line options parsed by Commander.js
   */
  public get opts(): commander.OptionValues {
    return this.prog.opts();
  }
  /**
   * call the parse() method of the Commander.js "program" object,
   * see https://github.com/tj/commander.js/#parse-and-parseasync
   * @param argv - the CLI arguments, usually process.argv
   */
  public parse(argv: string[]): void {
    this.prog.parse(argv);
  }
  /**
   * copy the pre-configuration file from opinioned tool package to a dir relative to current dir
   * @param fname - the local file name, must match the configuration file suffix (default to '.json')
   * @param dirName - optional, default to "localCopyDir" option, which default to ".opToolsConfig"
   */
  public localCopyConfig(
    fname: string,
    dirName = this.dirOptions.localCopyDir
  ): void {
    if (!fname.endsWith(this.dirOptions.configFileSuffix)) {
      throw new Error(
        `local file name ${fname} has different suffix than ${this.dirOptions.configFileSuffix}`
      );
    }
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    if (!fs.statSync(dirName).isDirectory()) {
      throw new Error(`${dirName} is not a directory`);
    }
    const localConfigPath = path.join(dirName, fname);
    fs.copyFileSync(
      this.configFilePathInPackage,
      localConfigPath,
      fs.constants.COPYFILE_FICLONE
    );
    this.localConfigPath = localConfigPath;
  }

  /**
   * First resolves the full path to the bin file of the given package by packageName and optional executable name, by inspecting
   * the "bin" field in the package's package.json, then invokes chalkedFork with the resolved path
   * @param packageName
   * @param executable
   * @param args
   * @param exitOnError
   * @returns
   *     Promise, that resolves to nothing, if child process exists normally with code 0,
   *         or exits the process with child exit code (exitOnError:true) without resolve/reject,
   *         or returns with the error object
   */
  public chalkedExecaSync(
    file: string,
    args?: readonly string[] | undefined,
    exitOnError = true
  ): void | execa.ExecaSyncError {
    if (this.opts.verbose) {
      /* istanbul ignore next */
      console.log(
        chalk.cyanBright("Running command: ") + file + " " + args?.join(" ") ||
          ""
      );
    }
    try {
      execa.sync(file, args, { preferLocal: true, stdio: "inherit" });
      return;
    } catch (error) {
      const syncError: execa.ExecaSyncError = error;
      if (exitOnError) {
        process.exit(
          typeof syncError.exitCode === "number" && syncError.exitCode !== 0
            ? syncError.exitCode
            : 1
        );
      } else {
        return syncError;
      }
    }
  }
}
