module.exports = {
  root: true,
  // common
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ["node_module", "build", "dist"],
  // settings by file types
  overrides: [
    // for Javascript, use air-bnb configs & run prettier
    {
      files: ["*.js", "*.tsx"],
      plugins: ["import"],
      extends: ["airbnb-base", "plugin:import/recommended", "prettier"],
      parserOptions: {
        ecmaVersion: 12,
      },
      rules: {
        "prettier/prettier": "error",
        // own rules here
      },
    },
    // for Typescript tests, prettier only
    {
      files: ["*.test.ts", "*.spec.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["prettier"],
      extends: ["prettier"],
      rules: {
        "prettier/prettier": "error",
      },
    },
    // for JSON
    {
      files: ["*.json"],
      plugins: ["json"],
      extends: ["plugin:json/recommended-with-comments"],
      rules: {
        "json/*": ["error", "allowComments"],
      },
    },
    // for Typescript, use recommended rules & run prettier
    {
      files: ["*.ts", "*.tsx"],
      excludedFiles: "*.test.ts",
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "import", "prettier"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
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
