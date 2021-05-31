import { execSync } from "child_process";
import { rmSync, statSync, readFileSync } from "fs";
import { join } from "path";

function cleanUp() {
  rmSync(join(__dirname, "dist"), { force: true, recursive: true });
  rmSync(join(__dirname, "docs"), { force: true, recursive: true });
}

describe("op-depcruise", () => {
  beforeEach(() => {
    cleanUp();
    process.chdir(__dirname);
  });
  afterEach(() => {
    cleanUp();
  });
  it("op-cruise should compile", () => {
    execSync("../dist/op-depcruise.js");
    expect(statSync("docs").isDirectory()).toEqual(true);
    expect(statSync("docs/api/dependency-graph.svg").isFile()).toEqual(true);
    expect(
      readFileSync("docs/api/dependency-graph.svg")!
        .toString()
        .startsWith("<?xml version=")
    ).toEqual(true);
  });
});
