#!/usr/bin/env bash

# Uncomment to the line below to use bash intelligent tab completion. WARNING! This will effect bash auto-complete functionality for all of our commands!
# bind "TAB:menu-complete"

__bitcar() {
    local cur=${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(bitcar --completions "$cur") )
}
complete -F __bitcar <%= alias %>
