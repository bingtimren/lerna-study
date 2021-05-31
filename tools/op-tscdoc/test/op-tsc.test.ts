import { execSync } from "child_process";
import { rmSync, statSync } from "fs";
import { join } from "path";

function cleanUp() {
  rmSync(join(__dirname, "dist"), { force: true, recursive: true });
  rmSync(join(__dirname, "docs"), { force: true, recursive: true });
}

describe("op-tscdoc", () => {
  beforeEach(() => {
    cleanUp();
    process.chdir(__dirname);
  });
  afterEach(() => {
    cleanUp();
  });
  it("op-tscdoc should compile", () => {
    execSync("../dist/op-tscdoc.js");
    expect(statSync("dist").isDirectory()).toEqual(true);
    expect(statSync("dist/good.js").isFile()).toEqual(true);
    expect(statSync("dist/good.d.ts").isFile()).toEqual(true);
    expect(statSync("dist/good.d.ts.map").isFile()).toEqual(true);
  });

  it("op-tscdoc doc should build docs", () => {
    execSync("../dist/op-tscdoc.js doc");
    expect(statSync("docs").isDirectory()).toEqual(true);
    expect(statSync("docs/api/index.html").isFile()).toEqual(true);
    expect(statSync("docs/api/typedoc.json").isFile()).toEqual(true);
  });
});
