# Branching Model & Work Flow

This project adopts [Vincent Driessen's Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/):
- To add features or fix bug:
  - Optionally create an issue on Github
  - Create and switch to a feature branch 'feature-', 'fix-', etc.
  - Make changes (test driven)
    - Add a test case
    - Run tests (new cases should fail)
    - Write code that pass the test
    - Run tests again, make all tests pass
    - Refactor if needed, keep tests pass
    - Document the code and update other documents
    - `npm fix` to fix style issues
    - `npm run cz` to commit
  - Merge back and push to 'develop' branch, or first creates a pull request for discussion and code review
- To release
  - Create / switch to a release branch 'alpha', 'beta', or 'stable'
  - Merge changes from develop branch
  - Only fix bugs in the release branch
  - Run `npm run release` to do a dry-run, check everything looks ok
  - When done, commit and push to github, this triggers release action on github
  - Check to make sure the release action is successful, and everything is fine
  - `git pull` to pull the release commit back to the local release branch
  - Merge back into "develop" and "main"

## Documentation

Write documents in /doc directory in markdown format. 

Document codes in [tsdoc](https://tsdoc.org/) standard format.

Run `npm run doc` to build the documentation.

Run `npm run doc:publish` to publish to github page.