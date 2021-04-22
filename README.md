# Lerna Study Repo

This project is for my experiment and study of Lerna Monorepo

## Initialization

`lerna init --independent`

## Import

`lerna import` import another GIT REPOSITORY into current monorepo as a project.
--flatten: flatten MERGE commit as single change (not squash)
--dest: change destination (by default under "./packages")

Cannot import a partial repo (i.e. import a project from another monorepo)

Can optional use 'git rebase' to squash commit history.


## `lerna create`

Ask a series of questions and create a project (package). Not very useful command. Without proper bootstrapping.
