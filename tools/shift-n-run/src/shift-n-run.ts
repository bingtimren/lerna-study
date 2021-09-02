#!/usr/bin/env node

import * as execa from "execa";
import * as parallel from "async-parallel";

export interface CLIOptions {
  n: string;
  arguments: string[];
  prefix: string;
  concurrency: string;
  command: string[];
}

export async function action(
  opts: CLIOptions
): Promise<execa.ExecaReturnValue[]> {
  const n: number = Number.parseInt(opts.n);
  const argPool: string[] = opts.arguments;
  const prefix: string = opts.prefix;
  const concurrency: number = Number.parseInt(opts.concurrency);

  if (argPool.length % n !== 0) {
    const message = `ERROR: ${argPool.length} pooled arguments received, ${n} arguments to be taken at a time, there is remainder after division.`;
    throw new Error(message);
  }
  // opts.command always has at least one element
  const command: string = opts.command.shift() as string;
  // parse the arguments, convert place-holders to numbers, check if position is valid
  const cmdArgs: (string | number)[] = (opts.command as string[]).map(
    (cmdArg) => {
      if (cmdArg.startsWith(prefix)) {
        const followVal = cmdArg.substr(prefix.length);
        const pos: number = Number.parseInt(followVal);
        if (Number.isNaN(pos)) {
          return followVal; // if not a number, return with prefix removed
        } else if (pos > n || pos < 1) {
          const message = `ERROR: place-holder ${cmdArg} must >0 and <= number of arguments taken at a time (${n})`;
          throw new Error(message);
        } else return pos;
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
  async function mapper(
    args: string[]
  ): Promise<execa.ExecaReturnValue | execa.ExecaError> {
    const proc = execa(command, args, {
      preferLocal: true,
    });
    try {
      return await proc;
    } catch (err) {
      return err as execa.ExecaError;
    }
  }

  // execution
  parallel.setConcurrency(concurrency);
  const mapResult = await parallel.map(argGroups, mapper);

  // report

  const errors: execa.ExecaError[] = mapResult.filter(
    (v) => v instanceof Error
  ) as execa.ExecaError[];
  if (errors.length > 0) {
    const errorMessages = [];
    errorMessages.push(`ERROR: ${errors.length} executions failed`);
    errors.forEach((err) => {
      errorMessages.push(`Command "${err.command}" failed: ${err.message}`);
    });
    throw new Error(errorMessages.join("\n"));
  }
  // no error, return result
  return mapResult;
}
