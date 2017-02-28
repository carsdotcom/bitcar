# ![bitcar](https://raw.githubusercontent.com/carsdotcom/bitcar/master/resources/bitcar.png)

> Seemlessly jump between repos from the command line.

![bitcar in action](https://raw.githubusercontent.com/carsdotcom/bitcar/master/bitcar-google-demo.gif)

## Requirements

   *  node 6.x.x or newer
   *  bash 3 or newer

_zsh support coming soon..._

## Installation

```
npm i -g bitcar
```

## Setup

```
bitcar --setup
```

Setup will drop a few dotfiles in `~/.bitcar` and it will append a few lines to your `~/.bash_profile`.

Note: You MUST use the command name you chose during setup. Only use the `bitcar` command itself for setup.

**IMPORTANT: Now, start a new terminal session.**

## Usage

In the examples below, it is assumed you have set your bitcar command to `bit`. If you've chosen a different command name, adjust accordingly.

### Search / Clone / Change Directory to Repo

```
bit {searchTerm}
```

### Open Repo in Browser

```
bit --open {searchTerm}
```

```
bit -o {searchTerm}
```

The `searchTerm` argument is optional. If no `searchTerm` is given, then bitcar will attempt to open the current directory's repo in the browser.

### Refresh Cache

```
bit --refresh
```

```
bit -r
```

This is done automatically the first time you try and use bitcar, but you can also manual refresh the cache when needed.

## Github personal access token settings

If you'd like to use bitcar with your private repos, you'll need to setup a
[personal access token on your github
account](https://github.com/settings/tokens/new). Please ensure you've set the
correct scope for this token. The `repo` scope should be fully enabled.

## License

Apache 2.0
