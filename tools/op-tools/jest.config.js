module.exports = {
  // ts-jest
  preset: "ts-jest",
  testEnvironment: "node",
  // paths
  rootDir: "..",
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  coverageDirectory: "dist/docs/coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "**/src/**/*.js",
    "!**/node_modules/**",
  ],
};
