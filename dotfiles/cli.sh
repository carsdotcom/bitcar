#!/usr/bin/env bash
function bitcar_cli() {
    local root="${BITCAR_ROOT_DIR:-"$HOME/bitcar-repos"}"
    [ -z "$1" ] && cd "$root" && return
    set -o pipefail
    BITCAR_CLI_TARGET_TMP=$(mktemp 2>/dev/null || mktemp -t tmp)
    BITCAR_CLI_SELECT_TMP=$(mktemp 2>/dev/null || mktemp -t tmp)
    set -- bitcar "$@" && "$@" | tee $BITCAR_CLI_SELECT_TMP && tail -1 $BITCAR_CLI_SELECT_TMP | "$HOME/.bitcar/strip_codes" >| $BITCAR_CLI_TARGET_TMP && echo && cd $(cat $BITCAR_CLI_TARGET_TMP)
}
alias <%= alias %>=bitcar_cli
