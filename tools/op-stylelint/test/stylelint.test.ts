import { execSync } from "child_process";
import { readFileSync, copyFileSync } from "fs";
describe("op-stylelint", () => {
  it("op-stylelint lints css", () => {
    try {
      execSync("dist/op-stylelint.js test/dirty.css test/dirty.scss 2>&1");
      fail("should throw");
    } catch (error: any) {
      // expect to fail
      expect(error.stdout.toString()).toMatch(
        /Expected a trailing semicolon\s+declaration-block-trailing-semicolon/
      );
      expect(error.stdout.toString()).toMatch(
        /Expected "noneExistingRule" to be "noneexistingrule"\s+property-case/
      );
      expect(error.stdout.toString()).toMatch(
        /Unexpected unknown property "noneExistingRule"/
      );
      expect(error.stdout.toString()).toMatch(
        /Expected "display" to come before "font"\s+order\/properties-order/
      );
      expect(error.stdout.toString()).toMatch(
        /Unexpected unknown property "noneExistingRuleScss"/
      );
    }
  });
  it("op-stylelint fixes CSS & SCSS", () => {
    execSync("dist/op-stylelint.js fix test/fixme.*css 2>&1");
    const css = readFileSync("test/fixme.css").toString();
    expect(css).toMatch(/font: 1em sans-serif;/);
    expect(css).toMatch(/display: block;\s+font: 1em sans-serif;/m);
    const scss = readFileSync("test/fixme.scss").toString();
    expect(scss).toMatch(/font: 1em sans-serif;/);
    expect(scss).toMatch(/display: block;\s+font: 1em sans-serif;/m);
    copyFileSync("test/backup/fixme.css", "test/fixme.css");
    copyFileSync("test/backup/fixme.scss", "test/fixme.scss");
  });
});
