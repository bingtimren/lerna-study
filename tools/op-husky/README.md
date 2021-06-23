# `@bingsjs/op-husky`

Pre-configured husky: install husky and the pre-configured hooks

## Usage

See `op-husky --help`

## Pre-configs 

See `op-husky list` and `op-husky print` or explore the [pre-configs](./pre-configs) dir

### default pre-config

Pre-commit: runs build, test, and op-lint-staged for further processing
Commit-msg: uses op-commitlint to enforce message format
Prepare-commit-msg: uses op-commitizen to prepare message

### lerna pre-config

Pre-commit: runs build & test with changed and affected packages only, and op-lint-staged for further processing
Commit-msg: uses op-commitlint to enforce message format
Prepare-commit-msg: uses op-commitizen to prepare message
