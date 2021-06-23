#!/usr/bin/env node

/* istanbul ignore file */

import { program } from "commander";
import * as chalk from "chalk";
import { CLIOptions, action } from "./shift-n-run";
program
  .name("shift-n-run")
  .description(
    "Run a command repeatedly, each time with a batch of fixed number of arguments taken from an Argument-Pool (like the bash 'shift' command), until the Argument-Pool is empty"
  )
  .requiredOption(
    "-c, --command <command-args...>",
    "(required) the command and the command's arguments to run each time. \n" +
      "When the command is installed with npm locally, the command can be executed directly without adding 'npx' or 'yarn'.\n" +
      "When a command's argument is to use an argument taken from the Argument-Pool (thus may differ each time), use place-holders such as ^1, ^2... to indicate the 1st, 2nd... arguments taken from the Argument-Pool.\n" +
      "When a command argument starts with '-' or '--', add the prefix '^' to prevent it from being interpreted as options of this (shift-n-run) command.\n" +
      "The prefix character '^' can be changed with option --prefix."
  )
  .requiredOption(
    "-a, --arguments <pooled-arguments...>",
    "(required) the arguments in the Argument-Pool, which are to be taken a fixed number (option -n) at a time for the repeated execution of the command"
  )
  .option(
    "-n <number-of-arguments>",
    "(optional) number of arguments to be taken at a time from the Argument-Pool",
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
  .option(
    "-v, --verbose",
    "(optional) show commands outputs even when succeed",
    false
  )
  .action(async () => {
    try {
      const results = await action(program.opts() as CLIOptions);
      console.log(chalk.cyanBright("All executions SUCCEED."));
      if (program.opts().verbose) {
        results.forEach((r) => {
          console.log(chalk.greenBright(`OUTPUTS from command: `) + r.command);
          if (r.stdout) {
            console.log(r.stderr);
          }
          if (r.stdout) {
            console.log(r.stdout);
          }
        });
      }
    } catch (error) {
      console.log(chalk.redBright("ERROR: execution finished with error"));
      console.log(chalk.yellowBright((error as Error).message));
      process.exit(1);
    }
  });

program.parse(process.argv);
