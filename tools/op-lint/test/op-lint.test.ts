import { execSync } from "child_process";
import { readFileSync, copyFileSync } from "fs";
describe("op-lint", () => {
  it("op-lint lints Typescript", () => {
    try {
      execSync("dist/op-lint.js test/dirty-code.ts 2>&1");
      fail("should throw");
    } catch (error: any) {
      // expect to fail
      expect(error.stdout.toString()).toMatch(
        /error\s*Unexpected var\, use let or const instead/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s*Unable to resolve path to module 'somethingNotExist'\s+import\/no-unresolved/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+'yaml' should be listed in the project's dependencies\. Run 'npm i \-S yaml' to add it\s+import\/no-extraneous-dependencies/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s*Insert \`\;\`\s*prettier\/prettier/
      );
    }
  });
  it("op-lint lints Javascript", () => {
    try {
      execSync("dist/op-lint.js test/dirty-code.js 2>&1");
      fail("should throw");
    } catch (error: any) {
      // expect to fail
      expect(error.stdout.toString()).toMatch(
        /error\s*Unexpected var\, use let or const instead/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+Insert \`\;\`\s+prettier\/prettier/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+The object literal notation \{\} is preferrable\s+no\-new\-object/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+Expected property shorthand\s+object-shorthand/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+Unable to resolve path to module.+import\/no-unresolved/
      );
      expect(error.stdout.toString()).toMatch(
        /import\/no-extraneous-dependencies/
      );
    }
  });
  it("op-lint lints JSON", () => {
    try {
      execSync("dist/op-lint.js test/dirty-code.json 2>&1");
      fail("should throw");
    } catch (error: any) {
      // expect to fail
      expect(error.stdout.toString()).toMatch(
        /error\s*Duplicate object key\s+json/
      );
      expect(error.stdout.toString()).toMatch(/error\s+Expected comma\s+json/);
      expect(error.stdout.toString()).toMatch(/error\s+Trailing comma\s+json/);
    }
  });
  it("op-lint lints Vue3", () => {
    // should pass
    expect(() => {
      execSync("dist/op-lint.js test/good-vue3.vue 2>&1");
    }).not.toThrow();

    try {
      execSync("dist/op-lint.js test/dirty-vue3.vue 2>&1");
      fail("should throw");
    } catch (error: any) {
      // expect to fail
      expect(error.stdout.toString()).toMatch(
        /error\s+Unable to resolve path to module 'vue'\s+import\/no-unresolved/
      );
      expect(error.stdout.toString()).toMatch(
        /warning\s+Prop "someTitle" should define at least its type\s+vue\/require-prop-types/
      );
      expect(error.stdout.toString()).toMatch(
        /warning\s+Unexpected any.+typescript-eslint\/no-explicit-any/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+Duplicated key 'someTitle'\s+vue\/no-dupe-keys/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+You should not use an arrow function to define a watcher\s+vue\/no-arrow-functions-in-watch/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s+Replace `someTitle` with.+prettier\/prettier/
      );
    }
  });
  it("op-lint fixes Typescript and Javascript", () => {
    execSync("dist/op-lint.js fix test/fixme.?s 2>&1");
    const js = readFileSync("test/fixme.js").toString();
    expect(js).toMatch(/const someValue \= 1\;/);
    expect(js).toMatch(/someValue\,/);
    const ts = readFileSync("test/fixme.ts").toString();
    expect(ts).toMatch(/const someValue \= 1\;/);
    expect(ts).toMatch(/export const value \= someValue\;/);
    copyFileSync("test/fixme.ts.backup", "test/fixme.ts");
    copyFileSync("test/fixme.js.backup", "test/fixme.js");
  });
});
