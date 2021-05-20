import { execSync } from "child_process";

describe("op-lint", () => {
    it("op-lint lints Typescript", () => {
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
    it("op-lint lints Javascript", () => {
        try {
            execSync("yarn op-lint test/dirty-code.js 2>&1");
            fail("should throw");
        } catch (error) {
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
        }
    });
    it("op-lint lints JSON", () => {
        try {
            execSync("yarn op-lint test/dirty-code.json 2>&1");
            fail("should throw");
        } catch (error) {
            // expect to fail
            expect(error.stdout.toString()).toMatch(
                /error\s*Duplicate object key\s+json/
            );
            expect(error.stdout.toString()).toMatch(
                /error\s+Expected comma\s+json/
            );
            expect(error.stdout.toString()).toMatch(
                /error\s+Trailing comma\s+json/
            );
        }
    });
}
);
