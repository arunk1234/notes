# Git branch in prompt.
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

# Customizing the prompt.
export PS1="\[\033[1;32m\]\u@\h:\[\033[1;34m\]\W\[\033[0m\]\[\033[1;33m\]\$(parse_git_branch)\[\033[0m\] $ "

# Git aliases.
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git pull'
alias gpp='git pull --prune'
alias gps='git push'
alias gco='git checkout'
alias gb='git branch'
alias gba='git branch -a'
