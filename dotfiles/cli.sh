#!/usr/bin/env bash
function bitcar_cli {
    local workspace_dir target cmd nbin
    workspace_dir="${BITCAR_WORKSPACE_DIR:-"$HOME/bitcar-repos"}"

    if [ -z "$1" ]; then
       cd "$workspace_dir";
       return
    fi

    target="$HOME/.bitcar/.bitcar_target"

    cmd=()
    nbin="$(ls -d1 $HOME/n/n/versions/node/* | egrep '6\.\d\.\d' | tail -1 | tr -d '[:space:]')/bin/node"
    if [[ -x "$nbin" ]]; then
        cmd+=( "$nbin" "$(which bitcar)" "$@" );
    else
        cmd=("bitcar" "$@")
    fi

    if "${cmd[@]}"; then

        [ -f "$target" ] && cd "$(cat "$target")" > /dev/null 2>&1

        if [ "$1" = "--edit" ] || [ "$2" = "--edit" ] || [ "$1" = "-e" ] || [ "$2" = "-e" ]; then
            if [ -n "$BITCAR_EDITOR_CMD" ]; then
                "$BITCAR_EDITOR_CMD" "$(cat "$target")/"
            fi
        fi

        [ -f "$target" ] && rm "$target"
    fi

}

alias bit=bitcar_cli
