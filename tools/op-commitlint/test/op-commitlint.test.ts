import { execSync } from "child_process";
import { join } from "path";
const cli = join(__dirname, "../dist/op-commitlint.js");
describe("op-commitlint", () => {
  it("shall pass good message", () => {
    execSync(`${cli} ${join(__dirname, "good-message")}`);
  });
  it("shall reject bad message", () => {
    try {
      execSync(`${cli} ${join(__dirname, "bad-message")}`);
      fail("should not pass");
    } catch (error: any) {
      expect(error.status).toEqual(1);
    }
  });
  it("shall reject non-existence message", () => {
    try {
      execSync(`${cli} ${join(__dirname, "non-exist-message")}`);
      fail("should not pass");
    } catch (error: any) {
      expect(error.status).toEqual(1);
    }
  });
});
