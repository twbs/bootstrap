BEGIN {
  FS="\t"
  REPO="https://github.com/twbs/bootstrap/issues"
  PRREPO="https://github.com/twbs/bootstrap/pull"
  na=split("Dialog/Drawer|Tooltip/Popover/Menu|ScrollSpy|JS (misc)|CSS|Remaining", AREAS, "|")
  nd=split("KEEP-BUG|VERIFY|NEEDS-VERIFY|DOCS|KEEP-FEATURE|CLOSE-RESOLVED|CLOSE-WONTFIX", DISPS, "|")
}
# file 1: states
NR==FNR { state[$1]=$2; next }
# file 2: data
{
  n=$1; a=$2; d=$3; pr=$4; why=$5
  key=a SUBSEP d
  rows[key]=rows[key] n "\x1f" pr "\x1f" why "\x1e"
  total++
  if (state[n]=="closed") closed++
}
END {
  open=total-closed
  print "# v6-dev Issue Audit — Master Ledger"
  print ""
  print "Single consolidated pickup point for the whole issue triage. Every triaged issue across all label passes, with its disposition, the v6 PR that fixes it (if any), and its **live GitHub state** at last sync."
  print ""
  printf "- **Total triaged:** %d issues · **✅ closed:** %d · **⬜ still open:** %d\n", total, closed, open
  print "- **Status** = live issue state on GitHub. **✅ = closed** (actioned/resolved). **⬜ = open** (still on the backlog, or its fix is in an unmerged PR — see PR column)."
  print "- Re-sync anytime with `v6-audit/sync-ledger.sh` (re-pulls live `gh` state and regenerates this file)."
  print ""
  print "**Disposition key:** `CLOSE-RESOLVED` fixed by the v6 rewrite · `CLOSE-WONTFIX` by-design/out-of-scope · `KEEP-BUG` real v6 bug · `KEEP-FEATURE` feature/roadmap · `DOCS` docs-only · `VERIFY` likely-resolved, confirm before close · `NEEDS-VERIFY` needs device/visual repro."
  print ""
  print "Source tables: `AUDIT.md`/`BATCH2.md` (Dialog/Drawer), `components/TRIAGE.md` (Tooltip/Popover/Menu), `js-label/TRIAGE.md` + `SCROLLSPY-CLUSTER.md` (JS/ScrollSpy), `css-label/TRIAGE.md` (CSS), `remaining/TRIAGE.md` (tail). PR↔issue map in `HANDOFF.md §8`; v5-PR port analysis in `PR-AUDIT.md`."
  print ""

  for (i=1;i<=na;i++) {
    a=AREAS[i]
    print "## " a
    print ""
    for (j=1;j<=nd;j++) {
      d=DISPS[j]
      key=a SUBSEP d
      if (!(key in rows)) continue
      m=split(rows[key], rr, "\x1e")
      # count non-empty
      cnt=0
      for (k=1;k<=m;k++) if (rr[k]!="") cnt++
      printf "### %s (%d)\n\n", d, cnt
      print "| | # | PR | Notes |"
      print "|---|---|---|---|"
      for (k=1;k<=m;k++) {
        if (rr[k]=="") continue
        split(rr[k], f, "\x1f")
        n=f[1]; pr=f[2]; why=f[3]
        em=(state[n]=="closed")?"✅":"⬜"
        prcell=(pr!="")?("[#" pr "](" PRREPO "/" pr ")"):""
        printf "| %s | [%s](%s/%s) | %s | %s |\n", em, n, REPO, n, prcell, why
      }
      print ""
    }
  }

  print "## Quick view — open KEEP-BUGs (the live backlog)"
  print ""
  print "| # | Area | PR | Notes |"
  print "|---|---|---|---|"
  for (i=1;i<=na;i++) {
    a=AREAS[i]
    key=a SUBSEP "KEEP-BUG"
    if (!(key in rows)) continue
    m=split(rows[key], rr, "\x1e")
    for (k=1;k<=m;k++) {
      if (rr[k]=="") continue
      split(rr[k], f, "\x1f")
      n=f[1]; pr=f[2]; why=f[3]
      if (state[n]!="open") continue
      prcell=(pr!="")?("[#" pr "](" PRREPO "/" pr ")"):""
      printf "| [%s](%s/%s) | %s | %s | %s |\n", n, REPO, n, a, prcell, why
    }
  }
  print ""
}
