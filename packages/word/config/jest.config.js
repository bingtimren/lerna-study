module.exports = {
  preset: 'ts-jest',
  rootDir: '../src',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  coverageDirectory: '../build/docs/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10
    }
  },
  collectCoverageFrom: ['**/*.ts']
};
