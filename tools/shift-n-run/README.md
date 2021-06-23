# `shift-n-run`

Run a command repeatedly, each time with a batch of a fixed number of arguments taken from a given Argument-Pool (like the bash 'shift' command), until the Argument-Pool is empty.

This is useful in circumstances such as, when wishes to use a utility with [lint-staged](https://github.com/okonet/lint-staged), however, the utility only accepts one file in its arguments at a time, but lint-staged runs tasks with a list of files as arguments. In this case, use `shift-n-run -c your-utility ^1 -a` in lint-staged configuration to run the utility repeatedly (in fact concurrently).

## Usage

To use, provide a command and the command's arguments with `-c` option, provide the arguments in the Argument-Pool with the `-a` option. Use place-holders such as `^1`, `^2` etc. in the command's arguments to indicate the arguments to be taken from the Argument-Pool. Use prefix `^` for the command's arguments that starts with '-' or '--' to distinguish with shift-n-run's own options.

For example, `shift-n-run -c echo ^1 = ^2 -a one 1 two 2 three 3 -v -n 2` runs the command and its arguments `echo ^1 = ^2` repeatedly, each time takes two arguments (specified by the `-n` option) from the Argument-Pool (provided by the `-a` option) to replace the place-holders (`^1` and `^2`), until the Argument-Pool is empty. The option `-v` shows the executed commands and the outputs.

The result of the example command is:

```
All executions SUCCEED.
OUTPUTS from command: echo one = 1

one = 1
OUTPUTS from command: echo two = 2

two = 2
OUTPUTS from command: echo three = 3

three = 3
```

When wishes to use the `echo` command's `-e` option, add a prefix `^` to distinguish it from shift-n-run's own options: `shift-n-run -c echo ^-e ^1 = ^2 \\n -a one 1 two 2 three 3 -v -n 2`

For more details, run with `--help`

```
Usage: shift-n-run [options]

Run the command repeatedly, each time with a fixed number of arguments taken from the pooled arguments (like the bash 'shift' command)

Options:
  -c, --command <command-args...>        (required) the command and the arguments to run each time, use place-holders such as ^1, ^2... to
                                         indicate arguments taken from the pooled arguments
  -a, --arguments <pooled-arguments...>  (required) the arguments to be taken a fixed number (option -n) at a time for the execution of the
                                         command
  -n <number-of-arguments>               (optional) number of arguments to be taken at a time (default: "1")
  --prefix <prefix>                      (optional) the prefix for the place-holders (default: "^")
  --concurrency <number-of-concurrency>  (optional) number of maximum concurrency, '0' indicates unlimited concurrency (default: "0")
  -v, --verbose                          (optional) show commands outputs even when succeed (default: false)
  -h, --help                             display help for command
```


## Install

`npm install -g shift-n-run`

Or install locally

