# Deferred — come back to these (need design decision or a repro not doable headlessly)

## Tooltip / Popover / Menu — "larger / design" tier
| # | Title | Why deferred |
|---|-------|--------------|
| 42065 | Tooltips/popovers should stay open when content is hovered | WCAG 1.4.13 — needs a new interactive/hoverable option + design |
| 38597 | Tooltip overlays fixed components when scrolling | z-index hierarchy decision (tooltip 1080 > fixed-top 1030) |
| 39026 | `abbr[title]` tooltip strips dotted underline | tooltip moves `title` to `data-bs-original-title`; fix has tradeoffs |
| 39010 | Popover triggers `click focus` can't combine to dismiss | trigger-model UX decision (maintainer leans intended) |
| 41167 | Arrow-key nav dead when toggle is `<input>` | likely Combobox territory — needs maintainer call |
| 41630 | Keyboard nav for tabs + tab dropdown menus | no shared roving-tabindex model; larger a11y work |
| 41670 | Menu in table clipped by row stacking contexts | needs portaling/container strategy |
| 41869 | autoClose:outside + keyboard leaves multiple submenus open | needs specific multi-menu repro before changing arrow handler |

## Can't verify headlessly (need device / visual at zoom)
| # | Title | Needs |
|---|-------|-------|
| 38414 | Firefox mobile-emulation double-toggle | Firefox engine (not installed here) |
| 38200 | Popover arrow at fractional zoom | visual check at 110/125% |
| 40624 | Popover border/arrow overlap | visual check on specific 1080p display |

## Component feature requests (kept open, unimplemented in v6)
31088 (popover: don't dismiss on click-inside), 37205 (caret indicator for menus),
38801 (arrow-key cycling / menubar APG), 38858 (log offending DOM node on duplicate-instance error).
