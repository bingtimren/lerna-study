module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'prettier'
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    ignorePatterns: [
      "**/*.spec.ts",
      "**/*.test.ts"
    ],
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "error"
    }
  };