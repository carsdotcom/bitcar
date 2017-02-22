#!/usr/bin/env bash
function bitcar_cli() {
    local workspace_dir="${BITCAR_WORKSPACE_DIR:-"$HOME/bitcar-repos"}"
    [ -z "$1" ] && cd "$workspace_dir" && return
    local target="$HOME/.bitcar/.bitcar_target"
    bitcar "$@" && if [ -f "$target" ]; then cd "$(cat "$target")" && rm "$target"; fi
}
alias <%= alias %>=bitcar_cli
