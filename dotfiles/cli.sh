#!/usr/bin/env bash
function bitcar_cli() {
    local workspace_dir="${BITCAR_WORKSPACE_DIR:-"$HOME/bitcar-repos"}"

    if [ -z "$1" ]; then
       cd "$workspace_dir";
       return
    fi

    local target="$HOME/.bitcar/.bitcar_target"
    bitcar "$@" && if [ -f "$target" ]; then cd "$(cat "$target")" && rm "$target"; fi
}
alias <%= alias %>=bitcar_cli
