import { execSync } from "child_process";

describe("op-lint", () => {
  it("op-lint lints typescript", () => {
    try {
      execSync("yarn op-lint test/dirty-code.ts 2>&1");
      fail("should throw");
    } catch (error) {
      // expect to fail
      expect(error.stdout.toString()).toMatch(
        /error\s*Unexpected var\, use let or const instead/
      );
      expect(error.stdout.toString()).toMatch(
        /error\s*Insert \`\;\`\s*prettier\/prettier/
      );
    }
  });
});
