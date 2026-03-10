#!/bin/bash
for dir in d:/AI_PROJECT/*/; do
  if [ -d "$dir/.git" ]; then
    name=$(basename "$dir")
    cd "$dir"

    # Check for changes
    if [ -n "$(git status --porcelain)" ]; then
      echo "=== $name: changes detected ==="
      git add -A
      git commit -m "chore: auto sync from $(hostname) on $(date '+%Y-%m-%d %H:%M')"
      git push
      echo ""
    else
      echo "=== $name: clean ==="
    fi
  fi
done
