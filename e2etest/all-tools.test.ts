import * as fs from "fs";
import * as path from "path";
import * as execa from "execa";
import * as pt from "child-process-toolbox";

jest.setTimeout(60000);

beforeEach(async () => {
  // clean up but keep husky, yarn.lock and node_modules to save time
  process.chdir(path.join(__dirname, "testProj"));
  expect(fs.statSync(".git").isDirectory()).toEqual(true);
  execa.commandSync("git reset --hard");
  execa.commandSync("git clean -fd");
  execa.commandSync("cp -r ../testProjChange/* .", { shell: true });
});

test("op-husky and git hooks", () => {
  expect(fs.statSync(".husky").isDirectory()).toEqual(true);
});

test("op-husky and git hooks - lint and commitizen", async () => {
  const gitCommit = execa.command("git commit -a");
  await Promise.all([
    pt.promiseOutputPattern(gitCommit, /BUILD SCRIPT EXECUTED/, {
      timeoutInMs: 10000,
    }),
    pt.promiseOutputPattern(gitCommit, /TEST SCRIPT EXECUTED/, {
      timeoutInMs: 10000,
    }),
    pt.promiseOutputPattern(
      gitCommit,
      /Select the type of change that you're committing/,
      { timeoutInMs: 10000 }
    ),
  ]);
  await pt.promiseKilled(gitCommit, "SIGKILL");
});
