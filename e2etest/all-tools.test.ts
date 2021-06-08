import * as fs from "fs";
import * as path from "path";
const nixt = require("nixt");

beforeAll(async () => {
  process.chdir(path.join(__dirname, "testProj"));
  fs.rmSync(".git", { recursive: true, force: true });
  nixt()
    .run("git init")
    .stdout(/Initialised empty Git repository/)
    .code(0)
    .end();
  nixt().run("git add .").code(0).end();
  nixt()
    .run(`git commit -m "init"`)
    .stdout(/2 files changed/)
    .code(0)
    .end();
  nixt({ colors: false })
    .run("yarn install")
    .stdout(/Resolving packages/)
    .stdout(/success Saved lockfile/)
    .exist("node_modules")
    .exist(".husky")
    .code(0)
    .end();
});
test("op-husky and git hooks", () => {});
