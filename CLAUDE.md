# CLAUDE.md

Bootstrap v6.0.0-alpha1 — CSS/JS framework.
Sass source in `scss/`, JS source in `js/src/`, docs site in `site/` (Astro 5 + MDX).

## Quick commands

- `npm start` — dev server (watch + Astro on port 9001)
- `npm run dist` — full CSS + JS build
- `npm run css` — compile, prefix, minify CSS
- `npm run js` — compile + minify JS
- `npm run css-lint` / `npm run js-lint` — lint
- `npm run docs-build` — build docs site
- `npm test` — full test suite (lint + dist + tests + docs)

## SCSS conventions

- Variable naming: `$component-state-property-size` (e.g., `$nav-link-disabled-color`)
- Module system: `@use` / `@forward` only — never `@import`
- Token system: component tokens are SCSS maps of CSS custom properties, merged via `defaults()`, output via `@include tokens($map)` on the component root selector
- Disallowed: raw `border-radius` / `transition` properties (use mixins), `lighten()` / `darken()`, `border: none` / `outline: none`
- Order: `@use` → `@forward` → `$variables` → `--custom-properties` → declarations → rules
- Variables use `!default` (except locals)
- CSS layers: `colors, theme, config, root, reboot, layout, content, forms, components, custom, helpers, utilities`
- Logical properties: prefer `padding-inline-start` over `padding-left`, etc.
- Modern CSS: `color-mix()`, `light-dark()`, range media queries (`@media (width >= 1024px)`)
- Doc markers: `// scss-docs-start name` / `// scss-docs-end name` for docs extraction

## JavaScript conventions

- ESM-only, no semicolons, 2-space indent
- Components extend `BaseComponent` (which extends `Config`)
- Constants: `NAME`, `DATA_KEY`, `EVENT_KEY`, `VERSION`
- DOM utilities via `dom/event-handler.js`, `dom/selector-engine.js`, `dom/manipulator.js`
- Floating UI for positioning (dropdown, tooltip, popover)
- Tests: Jasmine + Karma, specs in `js/tests/unit/*.spec.js`

## Docs conventions

- Astro 5 + MDX in `site/src/content/docs/`
- Frontmatter schema: `title` (required), `description` (required), `toc`, `aliases`, `added`, `mdn`, `reference`, etc.
- Shortcodes: `Example`, `Callout`, `Code`, `Details`
- Internal links: `[[docsref:/path/]]`

## Formatting

- 2 spaces, UTF-8, LF line endings, trim trailing whitespace, final newline
- Preserve smart punctuation (curly apostrophes U+2019, curly quotes) — never replace with ASCII equivalents
- Use `StrReplace` for targeted edits; avoid full-file rewrites on MDX files to protect typography

## Workflow

- Validate after changes: `npm run css-lint`, `npm run js-lint`, `npm run dist`, `npm run docs-build`
- Keep config files in sync: `config.yml`, `site/src/libs/config.ts` (Zod schema), `build/rollup.config.mjs`, `build/generate-sri.mjs`, `package.json`
- For rebases/conflicts: favor base branch structure, layer feature changes on top

## Do not edit

Built output in `dist/`, `_site/`, `js/dist/` — these are generated.
