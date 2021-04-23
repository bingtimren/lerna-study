module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  ignorePatterns: ['**/*.test.ts'],
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // fixable rules
    'no-extra-parens': 'error', // no extra parentheses
    curly: 'error', // enforce consistent brace style
    eqeqeq: 'error' // require using '===' and '!=='
  }
  /* Example Rules
  "rules": {
    // enable additional rules
    "indent": ["error", 4],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],

    // override configuration set by extending "eslint:recommended"
    "no-empty": "warn",
    "no-cond-assign": ["error", "always"],

    // disable rules from base configurations
    "for-direction": "off",
  }
  */
};
