#!/usr/bin/env bash
function bitcar_cli() {
    local root="${BITCAR_ROOT_DIR:-"$HOME/bitcar-repos"}"
    [ -z "$1" ] && cd "$root" && return
    local target="$HOME/.bitcar/.bitcar_target"
    bitcar "$@" && if [ -f "$target" ]; then cd "$(cat "$target")" && rm "$target"; fi
}
alias <%= alias %>=bitcar_cli
