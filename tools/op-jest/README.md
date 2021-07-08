# `@bingsjs/op-jest`

Pre-configured jest for testing

## Usage

See `--help`

To use with VS Code for debugging opened test file, create a launch config (.vscode/launch.json) as

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Active Jest Test",
            "cwd": "${workspaceFolder}", // or ${fileDirname} or $fileDirname}${pathSeparator}.. with lerna repo, see https://code.visualstudio.com/docs/editor/variables-reference
            "runtimeArgs": [
              "--inspect-brk",
              "${workspaceFolder}/node_modules/.bin/op-jest",
              "--debug",
              "${file}"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "outputCapture": "std",
            "skipFiles": ["<node_internals>/**"]
        }
    ]
}
```

Note: There's an issue with Typescript currently affecting some imported names in Typescript, see https://stackoverflow.com/questions/59864978/typescript-undefined-constant-during-debugging-session


## Assumptions

Tests can be written in Typescript or Javascript.

Test files are put under "test" dir or with `"**/?(*.)+(spec|test).[jt]s?(x)"` file name.


