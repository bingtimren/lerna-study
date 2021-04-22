# Lerna Study Repo

This project is for my experiment and study of Lerna Monorepo

## Initialization

`lerna init --independent`

## Basics & Bootstrapping

- Use local version of lerna
  - Set lerna version in package.json
  - `yarn install`
- Decide npm-client to use, npm or yarn
  - Upgrade yarn to v2: https://yarnpkg.com/getting-started/migration
    - `npm install -g yarn`
    - `yarn set version berry`
- Set root package.json to private to prevent publishing
  - `  "private":true,`
- Decide versioning mode - "independent" or a version number (for locked)
- hoist (or not)
  - hoisting improves speed and disk space, issues: (1) phantom package, i.e. works well in development env, break outside, solution: use eslint-plugin-import package (2) not all tools strictly follow node's module resolution algorithm therefore some fails
  To turn on: '--hoist' in CLI option or 
  ```json
    "command": {
      "bootstrap": {
        "hoist":"**"
      }
    },
  ```    
- packages - locations of projects

Use yarn workspace, in lerna.json

```json
  "npmClient": "yarn",
  "useWorkspaces": true
```


## `lerna import`

`lerna import` import another GIT REPOSITORY into current monorepo as a project.
--flatten: flatten MERGE commit as single change (not squash)
--dest: change destination (by default under "./packages")

Cannot import a partial repo (i.e. import a project from another monorepo)

Can optional use 'git rebase' to squash commit history.


## `lerna create`

Ask a series of questions and create a project (package). Not very useful command. Without proper bootstrapping.
