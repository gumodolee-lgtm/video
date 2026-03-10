#!/bin/bash
for dir in d:/AI_PROJECT/*/; do
  if [ -d "$dir/.git" ]; then
    echo "=== $(basename "$dir") ==="
    (cd "$dir" && git pull)
    echo ""
  fi
done
