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
    "node_module",
    "build",
    "dist",
  ],
  // settings by file types
  overrides: [
    // for Javascript, use air-bnb configs & run prettier
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
    // for Typescript tests, prettier only
    {
      files: ["*.test.ts", "*.spec.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["prettier"],
      extends: [
        "prettier",
      ],
      rules: {
        "prettier/prettier": "error",
      },
    },    

    // for Typescript, use recommended rules & run prettier
    {
      files: ["*.ts", "*.tsx"],
      excludedFiles:"*.test.ts",
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
