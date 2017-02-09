# ![bitcar](https://git.cars.com/projects/MP/repos/bitcar/raw/resources/bitcar.png?at=refs%2Fheads%2Fmaster)

> seemlessly jump between repos from the command line

## requirements

   *  node 6.x.x or newer

## installation and setup

    npm i -g
    bitcar --setup

IMPORTANT: Now, start a new terminal session.

    bit --init # or, instead of 'bit', you can use whatever alias you selected during setup

**Please note:** `bitcar --setup` will append a few lines to your `~/.bash_profile`. You'll want to remove these lines if you ever need to run the setup again.

## usage

### initialize cache

    bitcar --init

### refresh cache

    bitcar --refresh

### search / clone / cd to repo

    bit {searchTerm} # or, instead of 'bit', you can use whatever alias you selected during setup

## license

Apache 2.0
