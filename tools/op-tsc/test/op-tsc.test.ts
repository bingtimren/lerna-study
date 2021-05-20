import { execSync } from "child_process"
import { rmSync, statSync } from "fs"
import { join } from "path"

function cleanUp() {
    const testDist = join(__dirname, "dist");
    rmSync(testDist, { force: true, recursive: true })
}

describe("op-tsc", () => {
    it("op-tsc should compile", () => {
        cleanUp();
        process.chdir("test");
        execSync("../dist/op-tsc.js");
        expect(statSync("dist").isDirectory()).toEqual(true);
        expect(statSync("dist/good.js").isFile()).toEqual(true);
        expect(statSync("dist/good.d.ts").isFile()).toEqual(true);
        expect(statSync("dist/good.d.ts.map").isFile()).toEqual(true);
        cleanUp();
    })
})