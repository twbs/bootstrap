# AGENTS.md

Guidance for AI coding agents working in this repository. Tool-agnostic; `CLAUDE.md` points here.

Bootstrap v6.0.0-alpha1 — CSS/JS framework.
Sass source in `scss/`, TypeScript source in `js/src/`, docs site in `site/` (Astro 5 + MDX).

## Quick commands

- `npm start` — dev server (watch + Astro on port 9001)
- `npm run dist` — full CSS + JS build
- `npm run css` — compile, prefix, minify CSS
- `npm run js` — compile + minify JS
- `npm run css-lint` / `npm run js-lint` — lint
- `npm run docs-build` — build docs site
- `npm test` — full test suite (lint + dist + tests + docs)

## Writing style

Use ASD-STE100 Simplified Technical English for all prose: replies to the user, docs, code comments, commit messages, and PR text.

- Write short sentences. Use approximately 20 words or fewer.
- Give one instruction per sentence.
- Use the active voice. Name the actor.
- Use simple verbs. Do not use a complex verb when a simple one works.
- Use one term for one thing. Keep terms the same across the project.
- Keep paragraphs short. Cover one topic per paragraph.

## Teaching

Act as a teacher for JavaScript, TypeScript, React, and all JavaScript-family topics.

- When the work hits a new problem, concept, or language feature, stop and explain it.
- Keep each explanation short and plain. Define jargon on first use.
- Use a small code example when it makes the idea clear.
- Assume strong HTML/CSS knowledge. Do not assume deep JS internals knowledge.

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

## JavaScript/TypeScript conventions

- Source is TypeScript (`js/src/**/*.ts`, entry `js/src/index.ts`); ESM-only, no semicolons, 2-space indent
- Imports use `.js` extensions (standard TS ESM style); Rolldown resolves them to `.ts` via `resolve.extensionAlias`, Karma via `build/rollup-plugin-ts-resolve.cjs`
- Dist builds use Rolldown (`build/rolldown.config.mjs`, `build/build-plugins.mjs`) with built-in TS transforms; browser floors live in `build/browser-targets.mjs` (keep in sync with `.browserslistrc`). Karma still bundles specs with Rollup + Babel (`@babel/preset-typescript`)
- Strict tsconfig with `verbatimModuleSyntax` + `erasableSyntaxOnly`; `tsc` only type-checks and emits `.d.ts` (`npm run js-typecheck`, `npm run js-emit-types`)
- Components extend `BaseComponent` (which extends `Config`); per-component config `type XxxConfig` typed off `Default`, refined on the class via `protected declare _config: XxxConfig`
- Instance fields use `declare` (no runtime emit); constructor `element` param stays optional to keep `typeof Component` assignable to `typeof BaseComponent`
- Every `_`-prefixed instance member is `protected` (never `private`, so subclasses keep access); public API methods and statics stay public. This keeps the internals out of the published `.d.ts` surface
- Constants: `NAME`, `DATA_KEY`, `EVENT_KEY`, `VERSION`
- DOM utilities via `dom/event-handler.ts`, `dom/selector-engine.ts`, `dom/manipulator.ts`
- Floating UI for positioning (dropdown, tooltip, popover)
- Tests: Jasmine + Karma, specs in `js/tests/unit/*.spec.js` (plain JS, bundled against the TS sources); type-level API tests in `js/tests/types/` — `api.ts` checks the source (`npm run js-typecheck`), `consumer.ts` checks the shipped `js/dist/*.d.ts` through the package `exports` map (`npm run js-typecheck-dist`, after the build)

## Docs conventions

- Astro 5 + MDX in `site/src/content/docs/`
- Frontmatter schema: `title` (required), `description` (required), `toc`, `aliases`, `added`, `mdn`, `reference`, etc.
- Shortcodes: `Example`, `Callout`, `Code`, `Details`
- Internal links: `[[docsref:/path/]]`
- JS component "Dependencies" tables are auto-generated — add a `### Dependencies` heading with `<JsDependencies component="<js-src-basename>" />` (before `### Options`) on any doc for a `js/src/*.ts` component. The table is derived at build time by walking the component's import graph in `site/src/libs/js-dependencies.ts`; never hand-write the file list. When a new source file or third-party package enters the graph, add its human-readable label to `FILE_DESCRIPTIONS` / `PACKAGE_DESCRIPTIONS` in that lib (the build throws if a label is missing).

## Formatting

- 2 spaces, UTF-8, LF line endings, trim trailing whitespace, final newline
- Preserve smart punctuation (curly apostrophes U+2019, curly quotes) — never replace with ASCII equivalents
- Use `StrReplace` for targeted edits; avoid full-file rewrites on MDX files to protect typography

## Workflow

- Validate after changes: `npm run css-lint`, `npm run js-lint`, `npm run dist`, `npm run docs-build`
- Keep config files in sync: `config.yml`, `site/src/libs/config.ts` (Zod schema), `build/rolldown.config.mjs`, `build/generate-sri.mjs`, `package.json`
- For rebases/conflicts: favor base branch structure, layer feature changes on top

## Commits & PRs

- Commit messages: direct, succinct prose explaining why the change was made.
- PR descriptions: direct bulleted lists, minimal fluff — one bullet per notable change.
- Reference related issues/PRs explicitly with `Fixes #{issue}`, `Closes #{issue}`, or `Supersedes #{pr}`.
- No "Test plan" section and no extra headings — just the bullets and the references.

## Do not edit

Built output in `dist/`, `_site/`, `js/dist/` — these are generated.
