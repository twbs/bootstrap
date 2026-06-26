# Modal→Dialog / Offcanvas→Drawer issue audit (v6-dev)

v6 architecture (verified in `js/src/dialog-base.js`, `dialog.js`, `drawer.js`, `scss/_dialog.scss`):
- Native `<dialog>` element via `showModal()` / `show()` / `close()`, top-layer rendering.
- Native `::backdrop` (no `.modal-backdrop` div).
- **Native focus trap** — `js/src/util/focustrap.js` is NOT imported by dialog/drawer anymore.
- Native Escape via `cancel` event.
- No manual `aria-hidden` / `aria-modal` manipulation (browser handles modality).
- Body scroll-lock = `body.dialog-open { overflow: hidden }` — **no scrollbar compensation / no `scrollbar-gutter`**.
- Drawer modal vs non-modal: `useModal = Boolean(backdrop) || !scroll`.

## CLOSE — resolved/obsoleted by the native `<dialog>` rewrite
| # | Title | Why close |
|---|-------|-----------|
| 33727 | Can't close Modal via JS / backdrop persists | No separate backdrop div to leak (native `::backdrop`). Root cause was mixing data-API + JS; gone. |
| 34309 | Cannot set modal backdrop root element | Native `::backdrop` — no backdrop element/root to configure. |
| 36463 | `modal-open` removed when switching modals | v6 `_closeAndCleanup` keeps `dialog-open` while any `dialog[open]:modal` remains. Fixed. |
| 38814 | Hide listener on modal-backdrop (custom position) | `.modal`/`.modal-dialog` container model gone; native dialog is the element. Obsolete. |
| 39258 | FocusTrap stack overflow w/ focus-trap pkg | Dialog/drawer no longer use the custom FocusTrap util. |
| 39862 | Tab cycle scrolls page (confirmed) | Caused by custom focus-trap refocus; native focus trap. |
| 40873 | Sync backdrop & dialog transitions | `::backdrop` transitions with the dialog in CSS; staggering was a JS artifact. |
| 41005 | aria-hidden console warning (confirmed, high-traffic) | No manual `aria-hidden`; top layer + native inert. Resolved. |
| 41958 | Shift-Tab scrolls background | Same custom focus-trap cause as 39862; native focus trap. |
| 42440 | Avoid inline `display` styles (CSP) | Native dialog uses `[open]`, no inline `display:block/none`. (Was an explicit v5 request.) |
| 42503 | Focus-trap fails w/ no focusable element after modal | Native focus trap; DOM order irrelevant. |

## LIKELY RESOLVED — verify then close
| # | Title | Note |
|---|-------|------|
| 38447 | Offcanvas `backdrop:false` should be `aria-modal=false` | Native non-modal `show()` is used for `backdrop:false`+`scroll:true` and gets no aria-modal. Verify the `backdrop:false`+`scroll:false` case (still `showModal`). |

## KEEP — still applicable to v6-dev
| # | Title | Why keep |
|---|-------|----------|
| 34213 | Can't hide modal before "shown" | `hide()` still returns early while `_isTransitioning` (dialog-base.js:86). Persists. |
| 36962 | `data-bs-dismiss` broken for responsive offcanvas | Already labeled v6. Dismiss uses `.closest('.drawer')`; responsive variants use prefixed `lg:drawer` classes → won't match. Persists. |
| 39900 | NVDA reads all modal content on launch | A11y/SR behavior not clearly changed by native dialog; needs screen-reader testing. |
| 39972 | Content jumping when scrollbar toggles | `body.dialog-open` = bare `overflow:hidden`, no scrollbar-gutter/padding compensation → layout shift persists. |

## KEEP — feature requests (architecture-independent)
| # | Title | Why keep |
|---|-------|----------|
| 35664 | Allow changing options after creation (`setOptions()`) | General API request, still unaddressed. |
| 41188 | Reliable callback/API for transition completion | `show()`/`hide()` still no-op when already in target state, so `shown`/`hidden` won't fire — core complaint persists. |
