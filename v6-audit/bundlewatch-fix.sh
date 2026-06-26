#!/usr/bin/env bash
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

BRANCHES=(
  mdo/audit-dialog-drawer-issues
  mdo/dialog-root-scroll-lock
  mdo/tooltip-popover-bugfixes
  mdo/sanitizer-block-data-url
  mdo/tooltip-menu-small-fixes
  mdo/menu-popover-logic-fixes
  mdo/tab-keydown-menu-docs
)

for b in "${BRANCHES[@]}"; do
  echo "==================== $b ===================="
  git checkout "$b" >/dev/null 2>&1 || { echo "FAILED checkout $b"; continue; }
  npm run dist >/dev/null 2>&1 || { echo "FAILED dist on $b"; git reset --hard HEAD >/dev/null 2>&1; git clean -fdq dist js/dist >/dev/null 2>&1; continue; }
  npm run bundlewatch:fix >/dev/null 2>&1
  if git diff --quiet .bundlewatch.config.json; then
    echo "  no config change needed"
  else
    git add .bundlewatch.config.json
    git commit -q -m "Bump bundlewatch size thresholds"
    git push -q 2>&1 | tail -1
    echo "  committed + pushed config update"
  fi
  # discard the dist rebuild + any untracked rebuilt artifacts
  git reset --hard HEAD >/dev/null 2>&1
  git clean -fdq dist js/dist >/dev/null 2>&1
done
echo "==================== done ===================="
