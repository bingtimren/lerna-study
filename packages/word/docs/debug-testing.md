# Debug and Testing

Jest & ts-jest is used for testing.

## Debug (in VS Code)

Use the two launch configurations "Debug Active Jest Test" and "Debug All Jest Tests" to debug unit tests. 

When using "Debug Active Jest Test", select a test case (".test.ts") in active editor window.

## Unit Tests

Unit tests should be in suffix ".test.ts" and be put in the same directory of the source file. "tsconfig-build.json" is configured to exclude the test files in building.

## Packaging Tests

Tests the packed npm package as if installed from a repository.

## Coverage

See jest configuration file for coverage requirements.





