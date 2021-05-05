# Lerna Study Repo

This project is for my experiment and study of Lerna Monorepo

## Initialization

`lerna init --independent`

## Basics & Bootstrapping

- Use local version of lerna (recommended)
  - Set lerna version in package.json (done already if use lerna init)
  - `yarn install`

- Decide npm-client to use, npm or yarn (recommended yarn)
    ```
    // lerna.json
    "npmClient": "yarn",
    ```
- Set root package.json to private to prevent publishing
  - `  "private":true,`

- Decide versioning mode - "independent" or a version number (for locked)

- hoist (NOT recommend)
  - hoisting improves speed and disk space, issues: (1) phantom package, i.e. works well in development env, break outside, solution: use eslint-plugin-import package (2) not all tools strictly follow node's module resolution algorithm therefore some fails.
  - --hoist is not supported with npm client = yarn, recommended to use yarn workspace

- set locations of projects
  - By default "packages"
  - Add other categories such as apps etc.

- Use yarn workspace (RECOMMENDED)
  
  In lerna.json

```json
  "npmClient": "yarn",
  "useWorkspaces": true
```

  In package.json

  ```json
  // package.json
  {
    "workspaces": [
      "packages/*"
    ]  
  }
  ```

- if use jest
  - `yarn add --dev @types/jest` at monorepo root, so that VS Code can handle tests 

## Experiments and observations

Yarn workspace works well with lerna. All packages hoisted to root dir. This has the "phantom package" issue but can be solved with some build step checks. Comparing to rush, rush links packages under each project, this avoids phantom package, but then needs "auto installer" to install packages used in scripting. Also need to config scripting command while lerna does not need to do that.


## Learn Commands

### `lerna run`

--stream prefix output with package, recommended
--since git-tag only run command in package that has changed since tag (not since last run)

### `lerna import`

`lerna import` import another GIT REPOSITORY into current monorepo as a project.
--flatten: flatten MERGE commit as single change (not squash)
--dest: change destination (by default under "./packages")

Cannot import a partial repo (i.e. import a project from another monorepo)

Can optional use 'git rebase' to squash commit history.


## `lerna create`

Ask a series of questions and create a project (package). Not very useful command. Without proper bootstrapping.
