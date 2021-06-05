#!/usr/bin/env node
/* istanbul ignore file */

import { program } from "commander";
import * as execa from "execa";
import * as chalk from "chalk";
import * as parallel from "async-parallel";

program
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
    // console.log(program.opts());
    const opts = program.opts();
    const n: number = Number.parseInt(opts.n);
    const argPool: string[] = opts.arguments;
    const prefix: string = opts.prefix;
    const concurrency: number = Number.parseInt(opts.concurrency);

    if (argPool.length % n !== 0) {
      console.error(
        `ERROR: ${argPool.length} pooled arguments received, ${n} arguments to be taken at a time, there is remainder after division.}`
      );
      process.exit(1);
    }
    // opts.command always has at least one element
    const command: string = opts.command.shift();
    // parse the arguments, convert place-holders to numbers, check if position is valid
    const cmdArgs: (string | number)[] = (opts.command as string[]).map(
      (cmdArg) => {
        if (cmdArg.startsWith(prefix)) {
          const pos: number = Number.parseInt(cmdArg.substr(prefix.length));
          if (pos > n || pos < 1) {
            console.error(
              `ERROR: place-holder ${cmdArg} must >0 and <= number of arguments taken at a time (${n})`
            );
            process.exit(1);
          }
          return pos;
        } else {
          return cmdArg;
        }
      }
    );

    // preparing the argument groups
    const argGroups: string[][] = [];
    for (let gStart = 0; gStart < argPool.length; gStart += n) {
      const args: string[] = [];
      argGroups.push(args);
      cmdArgs.forEach((argOrPos) => {
        if (typeof argOrPos === "number") {
          args.push(argPool[gStart + argOrPos - 1]);
        } else {
          args.push(argOrPos);
        }
      });
    }

    // the mapper for p-map
    async function mapper(args: string[]): Promise<void | execa.ExecaError> {
      try {
        await execa(command, args, {
          preferLocal: true,
        });
      } catch (err) {
        return err;
      }
    }

    // execution
    parallel.setConcurrency(concurrency);
    const mapResult = await parallel.map(argGroups, mapper);

    // report
    console.log(chalk.cyan(`Command execution finished`));
    const errors: execa.ExecaError[] = mapResult.filter(
      (v) => v !== undefined
    ) as execa.ExecaError[];
    if (errors.length > 0) {
      console.error(`ERROR: ${errors.length} executions failed`);
      errors.forEach((err) => {
        console.log(
          chalk.redBright(`Command ${err.command} FAILED: `) + err.message
        );
      });
    }
    process.exit(1);
  });

program.parse(process.argv);
