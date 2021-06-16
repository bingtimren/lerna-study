[![Build and Test](https://github.com/bingtimren/op-tools/actions/workflows/build-test.yml/badge.svg)](https://github.com/bingtimren/op-tools/actions/workflows/build-test.yml)

# Opinioned Tools

"Opinioned Tools" is a set of pre-configured ("opinionated") development tools. 

<!-- toc -->

# Why "opinionated" tools?

If a project setup follows a certain assumptions (the "conventions") of these tools, then these tools can be used "out-of-box". You sacrifice a little flexibility, for the following benefits of using these tools:

- Tool setup is as simple as adding a development dependency. As long as your project follows some reasonable conventions, these tools can be used (almost) without configuration nor further dependency.
- These tools can be used individually, or as a "tool-set". Adding a "tool-set" into development dependency equivalents to adding all the tools in the tool-set.
- Your "package.json" and project root directory is no more cluttered by your tools' configurations and their dependencies.
- These tools, including their pre-configurations, can be updated by normal npm package update mechanism.

# Assumptions (Conventions)

Projects that use these tools are assumed to follow these conventions:

Project layout:
- "/src": Typescript sources 
- "/dist": Output files (.js, .d.ts, .js.map, etc.) emitted by tsc 
- "/test": Tests are put under "test" dir and are named with suffix ".test.ts", ".spec.ts", ".test.js", or ".spec.js"
- "/docs": Documents, and generated API documents are put under "docs/api" dir

More on each tool's assumption about the user project and the tool's function, please check each tool's document.

# Contents

This monorepo includes libraries, tools and tool-sets as follows:

## Tool-set
- [@bingsjs/ts-std-tools](tool-sets/ts-std-tools): tool-set with all the "opinionated tools" in this repo, configured for a "normal" (single project) Typescript project repository

## Tools
- [@bingsjs/op-commitizen](tools/op-commitizen): pre-configured commitizen for composing and formatting git commit messages
- [@bingsjs/op-commitlint](tools/op-commitlint): pre-configured commitlint for linting git commit messages
- [@bingsjs/op-depcruise](tools/op-depcruise): pre-configured [dependency cruiser](https://www.npmjs.com/package/dependency-cruiser) for visualize dependencies with graphs
- [@bingsjs/op-husky](tools/op-husky): pre-configured husky to initiate and install pre-configured git hooks
- [@bingsjs/op-jest](tools/op-jest): pre-configured jest for testing with Typescript with code coverage
- [@bingsjs/op-lint](tools/op-lint): pre-configured eslint for analyzing and fixing Typescript, Javascript and JSON codes
- [@bingsjs/op-lint-staged](tools/op-lint-staged): pre-configured [lint-staged](https://github.com/okonet/lint-staged) to run pre-configured processes against staged git files
- [@bingsjs/op-tscdoc](tools/op-tscdoc): pre-configured Typescript compiler (tsc) and [TypeDoc](https://typedoc.org/) for compiling Typescript into Javascript and generating API documentation

## Libraries
- [@bingsjs/op-tools](tools/op-tools): provide functions commonly used by the "opinionated tools" included here
- [shift-n-run](tools/shift-n-run): Take multiple arguments, shift (like the BASH 'shift' built-in command) n arguments each time and runs a command with the arguments, repeatedly (or concurrently) until all arguments are used.


