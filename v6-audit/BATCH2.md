# Batch 2 triage — 36 open modal/offcanvas/dialog/drawer issues

Unlike batch 1 (whole classes eliminated → confident close), this batch is mixed and several
need a quick behavior check in v6 before closing. Buckets below; nothing posted/closed yet.

## A. Likely resolved by the v6 architecture — verify, then close (14)
| # | Issue | v6 reason |
|---|-------|-----------|
| 38887 | offcanvas adds duplicate keydown listener each open | listeners bound once in `_addDialogListeners` (constructor), not per-open |
| 41473 | hide() then dispose() → `this._element is null` | `_queueCallback` now guards `if (!this._element) return` |
| 38162 | offcanvas won't close on Esc when backdrop:false | dialog-base has explicit non-modal keydown Esc handler |
| 37155 | static-backdrop offcanvas won't Esc after backdrop click | native `cancel` fires on Esc regardless of prior backdrop click |
| 39408 | can't focus element outside offcanvas | use `modal:false` → native non-modal allows outside focus |
| 38515 | can't focus input in Toast while Modal shown | native top-layer/inert (by design); use `modal:false` |
| 39780 | quick double-click during open crashes offcanvas | `_isTransitioning` guard blocks toggle mid-transition |
| 41606 | extra focus stop on hidden element at end of modal | native `<dialog>` focus handling |
| 41059 | Android TalkBack reads background w/ offcanvas open | `showModal()` → native top-layer/inert (beats `aria-modal`) |
| 34584 | body-scrolling offcanvas focus concept confusing (v6 a11y) | native non-modal `show()` semantics |
| 37613 | allow synchronous hide after removing `fade` | `dialog-instant`/`drawer-instant` class → `_isAnimated()` false |
| 41430 | modal.show() slow reflow (points at scrollbar.js getWidth) | dialog/drawer no longer use ScrollBarHelper / width measurement |
| 40640 | modal width breakpoints as CSS variables | `--dialog-width` token settable per element |
| 39987 | offcanvas/modal open+close immediately on touch | native `::backdrop`; verify the manual-pointer-open case |

## B. KEEP — still applicable v6 bugs
| # | Issue | Why it persists |
|---|-------|-----------------|
| 42459 | dialog content overflows on resize (**reported on v6-dev**) | current v6 bug — confirm fix |
| 38070 | close scrolls back to trigger element [25 comments] | data-API still `this.focus()` w/o `{preventScroll}` |
| 41615 | close scrolls to top w/ `scroll-padding-top` (confirmed) | same focus-restore root |
| 35391 | restore focus with `{preventScroll: true}` | same root; partly the fix for the above |
| 36681 | offcanvas anchor click stops scrolling in Chrome (confirmed) | close-timing / focus-restore family |
| 35934 | dispose() on open modal leaves body mutations | dispose doesn't `_closeAndCleanup` → `dialog-open` stuck |
| 39910 | dispose() doesn't reset scrollbars | same dispose gap |
| 39221 | offcanvas open causes 1px displacement (scrollbar) | `dialog-open` = bare `overflow:hidden`, no compensation |
| 40659 | `scrollbar-gutter: stable` shifts content + white gutters | no scrollbar-gutter handling in scroll-lock |
| 40908 | Safari offcanvas open changes window width → media query | scrollbar/overflow side-effect |
| 39270 | navbar-offcanvas translateY causes page-width overflow | CSS, needs check against v6 examples |
| 39287 | initial transition missing when placement set via JS | verify with `@starting-style` drawer |
| 41307 | modal scale/position affected by pinch-zoom on iOS | applicable, but likely won't-fix (zoom artifact) |

## C. KEEP — feature requests (architecture-independent)
| # | Issue |
|---|-------|
| 31266 | chainable `.on()` listener method on components |
| 37158 | add keyboard-escape & focus options to Toasts |
| 38911 | responsive offcanvas placement per breakpoint |
| 39290 | re-evaluate modal configs on `show()` |
| 39433 | `modal-xxl` size (has-pr) |
| 41580 | close-button a11y without CSS (alerts/modals) |
| 37916 | make hide-on-window-resize optional |
| 36647 | close offcanvas on browser back button |

## D. Docs
| # | Issue |
|---|-------|
| 39415 | offcanvas-navbar example uses non-standard `offcanvas-collapse` — revisit for v6 |
