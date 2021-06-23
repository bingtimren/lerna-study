# `@bingsjs/op-tscdoc`

Compiles Typescript (tsc) and documents (typedoc)

## Usage

Run with `--help`

## Main Assumptions

Project layout:
- "/src": Typescript sources 
- "/dist": Output files (.js, .d.ts, .js.map, etc.) emitted by tsc 
- "/test": Tests are put under "test" dir and are named with suffix ".test.ts", ".spec.ts", ".test.js", or ".spec.js"
- "/docs": Documents, and generated API documents are put under "docs/api" dir

Project and Codes:
- tsc config "module":"es2020": emit ESM codes
- tsc config "esModuleInterop": true
- tsc config "target": "ES2020"
