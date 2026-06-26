#!/usr/bin/env bash
cd "$(git rev-parse --show-toplevel)"
mkdir -p /tmp/pr-bodies
for n in 42544 42545 42548 42549 42550 42551 42552 42553; do
  gh pr view "$n" --json body --jq .body > "/tmp/pr-bodies/$n.in" 2>/dev/null
  if grep -qi "Generated with \[Claude Code\]" "/tmp/pr-bodies/$n.in"; then
    # Drop the trailer line and trailing blank lines
    python3 -c "
import sys, re
s = open('/tmp/pr-bodies/$n.in').read()
s = re.sub(r'\n*🤖[^\n]*Generated with \[Claude Code\][^\n]*\s*$', '', s, flags=re.IGNORECASE)
open('/tmp/pr-bodies/$n.out','w').write(s.rstrip() + '\n')
"
    gh pr edit "$n" --body-file "/tmp/pr-bodies/$n.out" >/dev/null 2>&1 && echo "removed trailer from #$n" || echo "FAILED edit #$n"
  else
    echo "no trailer on #$n"
  fi
done
