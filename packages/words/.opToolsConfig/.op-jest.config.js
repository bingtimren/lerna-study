module.exports = {
    // ts-jest
    preset: 'ts-jest',
    testEnvironment: 'node',
    // paths
    rootDir:"../src",
    coverageDirectory: '../dist/docs/coverage',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: -10,
        },
    },
    collectCoverageFrom: ['**/*.ts'],    

};