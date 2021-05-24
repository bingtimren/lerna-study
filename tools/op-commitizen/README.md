# `@bingsjs/op-commitizen`

Pre-configured commitizen using conventional commit

## Usage

Either run directly or as git "prepare-commit-msg" hook

To run directly:

`yarn op-commitizen`

To run as git hook, add the "prepare-commit-msg" hook, and put the line below:

``` sh
exec < /dev/tty && yarn op-commitizen hook "$1" "$2" "$3" || true
```