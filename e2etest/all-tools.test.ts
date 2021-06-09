import * as fs from "fs";
import * as path from "path";
import * as execa from "execa";
import * as pt from "child-process-toolbox";

jest.setTimeout(60000);

beforeEach(async () => {
  // clean up but keep husky, yarn.lock and node_modules to save time
  process.chdir(path.join(__dirname, "testProj"));
  execa.commandSync("git reset --hard");
  console.error(process.cwd());
  execa.commandSync("git clean -fd");
  console.error(process.cwd());
  execa.commandSync("cp -r ../testProjChange/* .", { shell: true });
});

test("op-husky and git hooks", () => {
  expect(fs.statSync(".husky").isDirectory()).toEqual(true);
});

test("op-husky and git hooks - commitizen", () => {});
