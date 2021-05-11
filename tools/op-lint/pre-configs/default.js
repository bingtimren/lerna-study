module.exports = {
  root: true,
  // common
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    "**/*.spec.ts",
    "**/*.test.ts",
    "node_module",
    "build",
    "dist",
  ],
  // settings by file types
  overrides: [
    // for Javascript
    {
      files: ["*.js", "*.tsx"],
      extends: ["airbnb-base", "prettier"],
      parserOptions: {
        ecmaVersion: 12,
      },
      rules: {
        "prettier/prettier": "error",
        // own rules here
      },
    },
    // for Typescript
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "prettier"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        // put prettier LAST to override other configs
        "prettier",
      ],
      rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
  ],
};
