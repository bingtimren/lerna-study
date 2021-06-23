# `@bingsjs/op-tscdoc`

Compiles Typescript (tsc) and documents (typedoc)

## Usage

See `--help`

## Main Assumptions

Project layout:
- "/src": Typescript sources 
- "/dist": Output files (.js, .d.ts, .js.map, etc.) emitted by tsc 
- "/test": Tests are put under "test" dir and are named with suffix ".test.ts", ".spec.ts", ".test.js", or ".spec.js"
- "/docs": Documents, and generated API documents are put under "docs/api" dir

TSC Options:
- "module":"es2020": emit ESM codes
- "esModuleInterop": true
- "target": "ES2020"
