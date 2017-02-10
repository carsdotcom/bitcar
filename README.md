# ![bitcar](https://raw.githubusercontent.com/carsdotcom/bitcar/master/resources/bitcar.png)

> Seemlessly jump between repos from the command line.

## Requirements

   *  node 6.x.x or newer
   *  bash 3 or newer

_zsh support coming soon..._

## Installation & Setup

```
npm i -g bitcar
bitcar --setup
```

**IMPORTANT: Now, start a new terminal session.**

## Usage

### Initialize Cache

```
bitcar --init
```

This is done automatically the first time you try and use bitcar, but you can also invoke it manually with the above command.

### Refresh Cache

```
bitcar --refresh
```

### Search / Clone / Change Directory to Repo

```
bit {searchTerm}
```

### Open Repo in Browser

```
bit --open {searchTerm}
```

The `searchTerm` argument is optional. If no `searchTerm` is given, then bitcar will attempt to open the current directory's repo in the browser.

## license

Apache 2.0
