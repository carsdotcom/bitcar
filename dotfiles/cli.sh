#!/usr/bin/env bash
function bitcar_cli() {
    local workspace_dir="${BITCAR_WORKSPACE_DIR:-"$HOME/bitcar-repos"}"

    if [ -z "$1" ]; then
       cd "$workspace_dir";
       return
    fi

    local target="$HOME/.bitcar/.bitcar_target"

    if bitcar "$@" && [ -f "$target" ]; then
        cd "$(cat "$target")"
        if [ "$1" = "--edit" ] || [ "$2" = "--edit" ] || [ "$1" = "-e" ] || [ "$2" = "-e" ]; then
            if [ -n "$BITCAR_EDITOR_CMD" ]; then
                $BITCAR_EDITOR_CMD "$(cat "$target")/"
            fi
        fi
        rm "$target"
    fi
}
alias bit=bitcar_cli
