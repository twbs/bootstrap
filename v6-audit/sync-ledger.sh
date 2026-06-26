#!/usr/bin/env bash
# Re-sync MASTER-LEDGER.md: re-pull live issue state from GitHub and regenerate.
# Usage: bash v6-audit/sync-ledger.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"

# 1. Pull live state (open/closed) for every issue in ledger-data.tsv
cut -f1 ledger-data.tsv | sort -un \
  | xargs -P 12 -I {} sh -c 'gh api repos/twbs/bootstrap/issues/{} --jq "[.number, .state] | @tsv" 2>/dev/null || echo "{}	open"' \
  > ledger-states.tsv

# 2. Regenerate the markdown
awk -f build-ledger.awk ledger-states.tsv ledger-data.tsv > MASTER-LEDGER.md

echo "Synced. $(grep -c '^| [✅⬜]' MASTER-LEDGER.md 2>/dev/null || true) rows; see MASTER-LEDGER.md header for totals."
