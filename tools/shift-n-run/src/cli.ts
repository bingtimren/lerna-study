#!/usr/bin/env node

/* istanbul ignore file */

import { program } from "commander";
import * as chalk from "chalk";
import { CLIOptions, action } from "./shift-n-run";
program
  .name("shift-n-run")
  .description(
    "Run the command repeatedly, each time with a fixed number of arguments taken from the pooled arguments (like the bash 'shift' command)"
  )
  .requiredOption(
    "-c, --command <command-args...>",
    "(required) the command and the arguments to run each time, use place-holders such as ^1, ^2... to indicate arguments taken from the pooled arguments"
  )
  .requiredOption(
    "-a, --arguments <pooled-arguments...>",
    "(required) the arguments to be taken a fixed number (option -n) at a time for the execution of the command"
  )
  .option(
    "-n <number-of-arguments>",
    "(optional) number of arguments to be taken at a time",
    "1"
  )
  .option(
    "--prefix <prefix>",
    "(optional) the prefix for the place-holders",
    "^"
  )
  .option(
    "--concurrency <number-of-concurrency>",
    "(optional) number of maximum concurrency, '0' indicates unlimited concurrency",
    "0"
  )
  .action(async () => {
    try {
      await action(program.opts() as CLIOptions);
      console.log(chalk.cyanBright("All execution finished successful."));
    } catch (error) {
      console.log(chalk.redBright("ERROR: execution finished with error"));
      console.log(chalk.yellowBright((error as Error).message));
      process.exit(1);
    }
  });

program.parse(process.argv);
