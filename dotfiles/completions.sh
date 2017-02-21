#!/usr/bin/env bash
if [ -z "$ZSH_VERSION" ]; then
    __bitcar() {
        local cur=${COMP_WORDS[COMP_CWORD]}
        COMPREPLY=( $(bitcar --completions "$cur") )
    }
    complete -F __bitcar <%= alias %>
fi
