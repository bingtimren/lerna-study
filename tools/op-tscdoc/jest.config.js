module.exports = {
  // ts-jest
  preset: "ts-jest",
  testEnvironment: "node",
  // paths
  rootDir: ".",
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};
