import { action } from "../src/shift-n-run";
import { join } from "path";
import * as execa from "execa";

beforeEach(() => {
  process.chdir(join(__dirname, ".."));
});

test("a normal run", async () => {
  await execa("dist/cli.js", [
    "-c",
    "ls",
    "package.json",
    "^1",
    "-a",
    "README.md",
    "tsconfig.json",
    ".",
  ]);
});

test("a normal run, covering function action", async () => {
  await action({
    n: "1",
    arguments: ["README.md", "tsconfig.json", "."],
    command: ["ls", "package.json", "^1"],
    concurrency: "1",
    prefix: "^",
  });
});

test("a normal run, uses prefix, covering function action", async () => {
  await action({
    n: "1",
    arguments: ["README.md", "tsconfig.json", "."],
    command: ["ls", "^-l", "^1"],
    concurrency: "1",
    prefix: "^",
  });
});

test("error: from command execution", async () => {
  const cmdProc = execa("dist/cli.js", [
    "-c",
    "ls",
    "package.json",
    "^1",
    "-a",
    "README.md",
    "not-exist-1",
    "not-exist-2",
  ]);
  try {
    await cmdProc;
    fail("expect throw");
  } catch (error) {
    expect(cmdProc.exitCode).toEqual(1);
  }
});

test("error: from command execution, covering function action", async () => {
  try {
    await action({
      n: "1",
      arguments: ["README.md", "not-exist-1", "not-exist-2"],
      command: ["ls", "package.json", "#1"],
      concurrency: "1",
      prefix: "#",
    });
  } catch (error) {
    expect(error.message).toMatch(/ERROR: 2 executions failed/);
    expect(
      (error.message as string).includes(
        `Command "ls package.json not-exist-1" failed`
      )
    ).toBe(true);
    expect(
      (error.message as string).includes(
        `Command "ls package.json not-exist-2" failed`
      )
    ).toBe(true);
  }
});

test("test error: left over arguments, covering function action", async () => {
  try {
    await action({
      n: "2",
      arguments: ["a", "b", "c"],
      command: ["echo", "something", "^1"],
      concurrency: "1",
      prefix: "^",
    });
    fail("expect throw");
  } catch (error) {
    expect(error.message as string).toMatch(/there is remainder/);
  }
});

test("test error: left over arguments", async () => {
  const cmdProc = execa("dist/cli.js", [
    "-c",
    "echo",
    "^1",
    "-a",
    "a",
    "b",
    "c",
    "-n",
    "2",
  ]);
  try {
    await cmdProc;
  } catch (error) {
    expect(cmdProc.exitCode).toEqual(1);
  }
});

test("test error: placeholder error, covering function action", async () => {
  try {
    await action({
      n: "1",
      arguments: ["a", "b", "c"],
      command: ["echo", "^3"],
      concurrency: "1",
      prefix: "^",
    });
    fail("expect throw");
  } catch (error) {
    expect(error.message as string).toMatch(
      /place-holder.*must >0 and <= number of arguments/
    );
  }
});

test("test error: placeholder error", async () => {
  const cmdProc = execa("dist/cli.js", [
    "-c",
    "echo",
    "^2",
    "-a",
    "a",
    "b",
    "c",
  ]);
  try {
    await cmdProc;
  } catch (error) {
    expect(cmdProc.exitCode).toEqual(1);
  }
});
