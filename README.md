# ![bitcar](https://raw.githubusercontent.com/carsdotcom/bitcar/master/resources/bitcar.png)

> seemlessly jump between repos from the command line

# requirements

   *  node 6.x.x or newer
   *  bash 3 or newer

_zsh support coming soon..._

# installation and setup

    npm i -g bitcar
    bitcar --setup

**IMPORTANT: Now, start a new terminal session.**


# usage

## initialize cache

    bitcar --init

This is done automatically the first time you try and use bitcar, but you can also invoke it manually with the above command.

## refresh cache

    bitcar --refresh

## search / clone / cd to repo

    bit {searchTerm}

## open repo in browser

    bit --open {searchTerm}

`searchTerm` is optional. If no `searchTerm` is given, then bitcar will attempt to open the current directory's repo in the browser.

# license

Apache 2.0
