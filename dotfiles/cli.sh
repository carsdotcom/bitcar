#!/usr/bin/env bash
function bitcar_cli() {
    local root="${BITCAR_ROOT_DIR:-"$HOME/bitcar-repos"}"
    [ -z "$1" ] && cd "$root" && return
    bitcar "$@" && cd "$(cat "$BITCAR_ROOT_DIR/.bitcar_target" )"
}
alias <%= alias %>=bitcar_cli
