# v6-dev Issue & PR Audit — Handoff / System Doc

Everything needed to resume the v6-dev relevancy audit in a fresh session with low context.
This folder is a snapshot of the working notes (was `.context/issue-audit/`, which is gitignored).

> **Start here:** `MASTER-LEDGER.md` is the single consolidated pickup point — every triaged issue (262) with disposition, fixing PR, and **live open/closed state**. Re-sync its status anytime with `bash v6-audit/sync-ledger.sh`. The per-area `TRIAGE.md` files (below) hold the fuller reasoning.

---

## 1. Goal
Triage **every open issue and PR** for relevance to the **v6-dev** branch (the active dev line; `main` = v5 maintenance):
- **Close** issues already resolved by the v6 rewrite, or won't-fix/by-design.
- **Fix** small, clear v6 bugs via focused PRs.
- **Flag/port** v5 PRs whose fix still applies to v6.
- Keep real v6 bugs / feature requests / docs open as the backlog.

## 2. Current state (as of this snapshot)
- **All open issues triaged** (~193 reviewed across passes; ~120 closed).
- **Open audit PRs (mine), base `v6-dev`:** #42544, #42545, #42548, #42549, #42550, #42551, #42552, #42553, #42557 (see §8).
- **PR audit done:** 83 v5 PRs touch v6-rewritten components (see `PR-AUDIT.md`).
- Per-label results in: `AUDIT.md`, `BATCH2.md` (dialog/drawer); `components/TRIAGE.md` (tooltip/popover/menu); `js-label/TRIAGE.md` + `SCROLLSPY-CLUSTER.md`; `css-label/TRIAGE.md`; `feature-label/`; `remaining/TRIAGE.md`; `DEFERRED-BACKLOG.md`; `PR-AUDIT.md`.

## 3. Triage methodology (repeat per label/area)
1. List open issues for the label, dedupe vs already-triaged:
   `gh issue list --state open --label X --limit 500 --json number,title,labels --jq '...' > _all.txt`
2. Fetch each issue JSON (body + comments) in parallel: `gh issue view N --json number,title,state,labels,createdAt,body,comments > N.json &`
3. Establish the **v6 architecture facts** for the area (the "levers" — §4).
4. **Fan out** to parallel sub-agents in chunks of ~14–16, each given the architecture brief + the dispositions, reading the issue JSONs + the actual source. Dispositions: `CLOSE-RESOLVED`, `CLOSE-WONTFIX`, `KEEP-BUG`, `KEEP-FEATURE`, `DOCS`, `NEEDS-VERIFY`, `DUPLICATE`.
5. **Verify** the CLOSE-RESOLVED / NEEDS-VERIFY ones against real behavior (build + Playwright, §6) before closing — don't trust assertions.
6. Consolidate into a `TRIAGE.md`, then act (§5).

## 4. v6 architecture cheat-sheet (what resolves issues)
- **Modal → Dialog**, **Offcanvas → Drawer**: native `<dialog>` (`showModal`/`show`, native `::backdrop`, **native focus-trap**, top-layer). Removed `util/backdrop.js`, `util/focustrap.js`, `util/scrollbar.js`. Body scroll-lock = `:root.dialog-open { overflow:hidden }` (co-located with `scrollbar-gutter: stable` in `_root.scss`).
- **Dropdown → Menu**; **tooltip/popover/menu → Floating UI** (`@floating-ui/dom`; option is `floatingConfig`, not `popperConfig`).
- **ScrollSpy → IntersectionObserver** (my rewrite in #42557 = activation-line + geometry + scrollend).
- **Carousel → CSS scroll-snap** (autoplay opt-in: `autoplay:false`, `data-bs-autoplay="true"`).
- **Accordion → native `<details name>`** (NO JS — browser-enforced exclusivity; the JS double-open race is impossible). `collapse.js` still exists for `.collapse` + `data-bs-parent` legacy use.
- **New components:** combobox, chips, datepicker, otp-input, strength, range, nav-overflow, toggler, menu, drawer, dialog.
- **Color/CSS:** `oklch()` + `color-mix(in lab)`, `.theme-*` token system (`_theme.scss`), CSS `@layer`, `--radius-*` tokens, `light-dark()` + `color-scheme` per theme. Removed `$*-rgb` vars.
- **Sass/build:** dropped node-sass; `@use` throughout; removed `add()/subtract()` (use `calc()`), RFS, `$prefix` (PostCSS adds `--bs-`), `$enable-dark-mode`; `$grid-breakpoints`→`$breakpoints` (lg 1024 / xl 1280 / 2xl 1536); `breakpoint-infix()`→`breakpoint-prefix()`.
- **Class syntax:** Tailwind-style prefix `md:d-none` (was `.d-md-none`), `md:col-6`.
- **Selectors:** `parseSelector` (`util/index.js`) escapes ids via `CSS.escape`.
- **Forms:** floating label placed before control; validation via `:user-invalid`/`:user-valid` behind `[data-bs-validate]` (no `.was-validated`).

## 5. Closing workflow & comment style
- **Comment style:** direct, **no "thanks"** on bulk issue closes; end with `Closing — please open a new issue if it persists in v6-dev.` (the "out").
- **NEVER** include an AI/Claude trailer in PR bodies, or `Co-Authored-By` in commits (user preference — see repo memory).
- **Resolved by v6 work** → add `v6` label + add to **v6.0.0 project (#38)** + comment + close.
- **Won't-fix / by-design** → comment + close, **no** label/project.
- **Keep open** → bug / feature / docs / needs-verify.
- For **superseded v5 PRs** that aren't earmarked for a v5.x release (no v5.4.0/v6.0.0 project + no maintainer comment) → close with a comment linking the superseding v6 PR. Leave ones in a v5.x project alone.

## 6. Verification harnesses (Playwright) — `*.cjs` in this folder
- Build first: `npm run css-compile` and/or `npm run js-compile-bundle`.
- The bundle is **ESM** → to get a global, read it and `.replace(/export \{/, 'window.bootstrap = {')`, inject via `page.addScriptTag({ content, type:'module' })`, then `waitForFunction(() => window.bootstrap?.X)`.
- Examples: `verify-scrollspy.cjs`, `verify-accordion.cjs`, `verify-scrollbar.cjs`, `css-label/verify.cjs`, `components/verify.cjs`.
- **Gotchas:** headless Chromium renders **no scrollbars** (gutter/scrollbar checks inconclusive — verify on Windows/classic scrollbars). `scrollend` IS supported. WebKit + Chromium installed; **Firefox is not**. Force classic scrollbar layout isn't possible headless.

## 7. gh CLI gotchas (important)
- `gh issue edit` / `gh pr edit` are **broken** by a GitHub *projectCards* GraphQL deprecation. Use REST instead:
  - Add label: `gh api repos/twbs/bootstrap/issues/N/labels --method POST -f "labels[]=v6"`
  - Edit PR/issue body: `gh api repos/twbs/bootstrap/pulls/N --method PATCH -F body=@file`
- Add to project (needs `gh auth refresh -s read:project,project`): `gh project item-add 38 --owner twbs --url <issue-or-pr-url>`  (v6.0.0 = project **38**; v5.4.0 = **12**? confirm via `gh project list --owner twbs`).
- These work fine: `gh issue close N --comment "..."`, `gh pr close N --comment "..."`, `gh pr checks N`, `gh pr list/view --json files`.

## 8. My open audit PRs (base v6-dev) & what they fix
- **#42544** Dialog/Drawer focus-restore `{preventScroll}` + dispose cleanup → 38070, 41615, 35391, 35934, 39910
- **#42545** Dialog root scroll-lock (co-locate w/ scrollbar-gutter) → 39221, 39972, 40908, 40659
- **#42548** Tooltip prevented-show reset + boolean title/content → 39861, 41925
- **#42549** Sanitizer block `data:`/`vbscript:` (XSS) → 42443
- **#42550** Menu contenteditable + popover arrow header + docs → 41021, 40993, 40571
- **#42551** Popover setContent show-gate + forms-in-menu → 40525, 41803
- **#42552** Docs: navbar buttons, menu JS toggle, delegated tooltips → 40995, 37042, 41020
- **#42553** Tab modifier+arrow keys + menu Escape docs → 38565, 38035
- **#42557** ScrollSpy deterministic rewrite → 37858, 39198, 39248, 36387, 40526 (supersedes #41016/#41726)
- **Note:** if bundlewatch CI fails on a PR → checkout branch, `npm run dist && npm run bundlewatch:fix`, commit `.bundlewatch.config.json`, push (see `bundlewatch-fix.sh`).

## 9. What remains (the backlog) — see the TRIAGE files
- **Confirmed v6 bugs (~35):** e.g. 42328 (aria-pressed init), 40997 (data-bs-target complex selector), 40841 (collapse aria-expanded), 38517 (Map→WeakMap leak), 38480 (border contrast 1.63:1), 38808 (is-invalid focus-ring color), 42065 (hoverable tooltips), 42546 (`scrollbar-gutter` strip — ties to #42545), 36943/37821/41596/40702 (small CSS).
- **Port-candidates** (v5 PR ready for an open v6 issue) — see `PR-AUDIT.md`: top ones `#42528` (submenus→#41869), `#42466` (aria-pressed→#42328), `#41421` (abbr→#39026), `#39483` (float-label select), `#35151` (hoverable tooltips→#42065).
- **Feature requests (~55)**, **Docs (~20, incl. #42422 homepage `var(--bs-primary)`)**, **Needs-verify/can't-verify (~8)**.
- **ScrollSpy:** #42557 has a **coverage-threshold** CI miss (89% branches) + bundlewatch; the branch is checked out in the `/Users/mdo/work/b6-dev` worktree with the user's in-progress edits (`scrollspy.js`, spec, `DocsLayout.astro`) — don't touch until those land.

## 10. Files in this folder
- **`MASTER-LEDGER.md`** — consolidated 262-issue ledger (disposition + PR + live state), grouped by area→disposition, with an open-KEEP-BUG quick view. Regenerated by `sync-ledger.sh` from `ledger-data.tsv` (the hand-authored disposition map) + `build-ledger.awk` + live `gh` state in `ledger-states.tsv`.
- `*/TRIAGE.md` — per-label dispositions. `PR-AUDIT.md` — v5-PR port/obsolete/superseded (linked). `DEFERRED-BACKLOG.md` — design/repro-needed items.
- `*/comments/*.txt` — the actual close comments posted (reference for tone).
- `*.sh` — the batch close/label/project + bundlewatch scripts. `*.cjs` — Playwright verification harnesses.
