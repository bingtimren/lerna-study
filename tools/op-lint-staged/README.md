# `@bingsjs/op-lint-staged`

Pre-configured lint-staged to process staged files

## Usage

Put a line in git "pre-commit" hook

`yarn op-lint-staged`

## Pre-configs

See [pre-configs](./pre-configs) dir for pre-configuration(s)

By default:
 - Typescript (.ts): op-lint
 - Javascript (.js): op-lint
 - JSON (.json): op-lint and prettier
 - Markdown (.md): markdown-toc (compile Table of Content)