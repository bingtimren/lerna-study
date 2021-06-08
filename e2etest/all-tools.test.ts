import * as fs from "fs";
import * as path from "path";
import * as execa from "execa";
import * as pt from "child-process-toolbox";

jest.setTimeout(60000);

beforeAll(async () => {
  process.chdir(path.join(__dirname, "testProj"));
  fs.rmSync(".git", { recursive: true, force: true });
  fs.rmSync(".husky", { recursive: true, force: true });
  fs.rmSync("node_modules", { recursive: true, force: true });
  fs.rmSync("yarn.lock", { recursive: true, force: true });

  const gitInit = execa.command("git init");
  await pt.promiseOutputPattern(gitInit, /Initialised empty Git repository/, {
    timeoutInMs: 5000,
  });
  await gitInit;
  expect(fs.statSync(".git").isDirectory()).toEqual(true);

  await execa.command("git add .");

  const gitCommit = execa.command(`git commit -m "init"`);
  await pt.promiseOutputPattern(gitCommit, /3 files changed/, {
    timeoutInMs: 5000,
  });
  await gitCommit;

  await execa.command("yarn install", { stdio: "inherit" });
  expect(fs.statSync("node_modules").isDirectory()).toEqual(true);
});

test("op-husky and git hooks", () => {
  expect(fs.statSync(".husky").isDirectory()).toEqual(true);
});
