import { execSync } from "child_process";
import { rmSync, statSync } from "fs";
import { join } from "path";

function cleanUp() {
  rmSync(join(__dirname, "dist"), { force: true, recursive: true });
  rmSync(join(__dirname, "op-tscdoc.tsbuildinfo"), { force: true });
}

describe("op-tscdoc", () => {
  it("op-tscdoc should compile", () => {
    cleanUp();
    process.chdir("test");
    execSync("../dist/op-tscdoc.js");
    expect(statSync("dist").isDirectory()).toEqual(true);
    expect(statSync("dist/good.js").isFile()).toEqual(true);
    expect(statSync("dist/good.d.ts").isFile()).toEqual(true);
    expect(statSync("dist/good.d.ts.map").isFile()).toEqual(true);
    cleanUp();
  });
});
