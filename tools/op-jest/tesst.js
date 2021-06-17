#!/usr/bin/env node

// intentionally misspelled file name in order to avoid op-jest running it as a test (causing dead-loop)

const childProcess = require("child_process");

function checkResults(regExArray, output) {
  regExArray.forEach((pattern) => {
    if (output.match(pattern) === null) {
      throw new Error(
        `ERROR: pattern ${pattern} not found in output ${output}`
      );
    }
  });
}

const goodResults = [/PASS test\/good\.test\.ts/, /this should pass/];

const coverageResults = [
  /Jest: Uncovered count for statements \([0-9]+\) exceeds global threshold \([0-9]+\)/,
  /Jest: "global" coverage threshold for branches \(\d+%\) not met/,
];

// for a good run
const goodOutput = childProcess
  .execSync("node dist/op-jest.js 2>&1")
  .toString();
checkResults(goodResults, goodOutput);

// for a bad coverage run
try {
  childProcess.execSync("node dist/op-jest.js --coverage 2>&1").toString();
  throw new Error("should throw");
} catch (error) {
  checkResults(coverageResults, error.stdout.toString());
}
