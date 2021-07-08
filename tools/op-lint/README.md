# `@bingsjs/op-lint`

Opinionated eslint

Run eslint with ready configuration files and additional dependencies (plugins, parsers, prettier, etc.), therefore is ready to use without configuration.

Lint and "prettier" Typescript (.ts), Javascript (.js), JSON (.json) and tests (.test.ts .spec.ts, only do "prettier" without linting)

## Pre-configuration

See ["pre-configs"](./pre-configs)

Javascript:
- Uses air-bnb rules
- Lint imports with eslint-plugin-import
- prettier

Typescript:
- Use recommended pre-sets from eslint and plugins
- Lint imports with eslint-plugin-import
- prettier

JSON:
- Use "recommended-with-comments" pre-set
- Allow comments
- (no prettier, for JSON have to use prettier directly)

Typescript tests:
- Just do "prettier"

Vue Single-File-Component (.vue):
- Use Typescript parser (expects typescript codes in script section)
- Use "vue/vue3-strongly-recommended" pre-set

## Usage

See `--help`

Use manually:

`yarn op-lint **/*.ts **/*.json **/*.js`

Can also use with lint-staged
