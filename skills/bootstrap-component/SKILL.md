---
name: bootstrap-component
description: Build a Bootstrap 6 component's CSS and markup. Use when creating a new component, adding modifier or variant classes, or authoring component styles with Bootstrap's Sass token maps and theme overrides.
guide: /customize/components
---

# Bootstrap 6 component CSS

Author a component's styles and markup — the non-JavaScript pieces. Bootstrap 6 components are built from a Sass map of CSS custom properties (the token map), a base class that emits those tokens, and modifier classes that override them.

For interactive behavior, see the `bootstrap-component-js` skill. For palettes, theme colors, and color modes, see the `bootstrap-color-system` skill.

## Workflow

- [ ] Step 1: Plan the component
- [ ] Step 2: Create the partial and token map
- [ ] Step 3: Write the base class
- [ ] Step 4: Add modifiers, variants, and sizes
- [ ] Step 5: Wire up theme colors
- [ ] Step 6: Markup and accessibility
- [ ] Step 7: Register the partial
- [ ] Step 8: Document the component
- [ ] Step 9: Verify

---

## Step 1: Plan the component

1. Pick a singular, kebab-case name. It drives everything: the partial `scss/_<name>.scss`, the base class `.<name>`, the token prefix `--<name>-*`, and the map `$<name>-tokens`.
2. Decide what the component needs before writing CSS:
   - **Tokens only** — one look, customized through CSS variables. Model on `scss/_alert.scss`.
   - **Variants** — contextual color treatments like `.badge-subtle`. Model on `scss/_badge.scss`.
   - **Variants and sizes** — model on `scss/buttons/_button.scss`.
3. Check whether an existing component already covers the need. Extending one with a modifier is preferable to adding a near-duplicate.

Never edit generated output in `dist/`, `js/dist/`, or `_site/`. Source lives in `scss/` and `js/src/`.

---

## Step 2: Create the partial and token map

Create `scss/_<name>.scss`. Declare the empty map first, then fill it through `defaults()`:

```scss
@use "config" as *;
@use "functions" as *;
@use "mixins/border-radius" as *;
@use "mixins/tokens" as *;

$widget-tokens: () !default;

// scss-docs-start widget-tokens
// stylelint-disable-next-line scss/dollar-variable-default
$widget-tokens: defaults(
  (
    --widget-gap: var(--spacer-2),
    --widget-padding-x: var(--spacer-4),
    --widget-padding-y: var(--spacer-2),
    --widget-color: var(--theme-fg, inherit),
    --widget-bg: var(--theme-bg-subtle, var(--bg-1)),
    --widget-border-color: var(--theme-border, var(--border-color)),
    --widget-border-radius: var(--radius-5),
  ),
  $widget-tokens
);
// scss-docs-end widget-tokens
```

Rules that matter here:

- The `$widget-tokens: () !default;` line is what makes the map overridable — `@use "bootstrap/scss/bootstrap" with ($widget-tokens: (…))` writes into it, and `defaults()` merges those overrides over your defaults. Passing `null` for a key removes that token entirely.
- The second assignment needs the `stylelint-disable-next-line scss/dollar-variable-default` comment, since it intentionally reassigns without `!default`.
- Token names are namespaced to the component and written **unprefixed**. Bootstrap's dist and CDN CSS run PostCSS to add the `--bs-` prefix (`--bs-widget-bg`); compiling the source yourself keeps them unprefixed.
- Build values from existing global tokens — `var(--spacer-3)`, `var(--radius-5)`, `var(--border-width)`, `var(--font-weight-semibold)` — rather than hardcoded lengths, so the component scales with the rest of the framework.
- The `scss-docs-start` / `scss-docs-end` markers are load-bearing: the docs page renders the map with `<ScssDocs>`, which throws at build time if the markers are missing.

---

## Step 3: Write the base class

Declarations go inside a cascade layer, with the token map emitted on the root selector:

```scss
@layer components {
  .widget {
    @include tokens($widget-tokens);

    display: flex;
    gap: var(--widget-gap);
    align-items: center;
    padding: var(--widget-padding-y) var(--widget-padding-x);
    color: var(--widget-color);
    background-color: var(--widget-bg);
    border: var(--border-width) solid var(--widget-border-color);
    @include border-radius(var(--widget-border-radius));
  }
}
```

- Pick the right layer. Components use `@layer components`, form controls `@layer forms`, helpers `@layer helpers`. The order is declared once in `scss/_root.scss`: `colors, config, root, reboot, layout, content, forms, components, custom, helpers, utilities`.
- `@include tokens($widget-tokens)` comes first, then declarations, then nested rules. Declarations read `var(--widget-*)`, never the Sass map directly.
- Use `@include border-radius()` and `@include transition()` instead of the raw properties — stylelint blocks the raw ones because the mixins honor `$enable-rounded`, `$enable-transitions`, and `prefers-reduced-motion`.
- Use logical properties (`padding-inline-start`, `margin-block-end`, `inset-inline-start`) so the component works in RTL without an override.
- No `lighten()` / `darken()` — use `color-mix()`, relative `oklch()`, or `light-dark()`. No `border: none` / `outline: none` — use `0`.

---

## Step 4: Add modifiers, variants, and sizes

A modifier only overrides tokens; it should not repeat the base declarations:

```scss
.widget-lg {
  --widget-padding-x: var(--spacer-6);
  --widget-padding-y: var(--spacer-3);
  --widget-border-radius: var(--radius-7);
}
```

When a component has a set of contextual treatments, drive them from an overridable map whose values are **theme sub-keys**, then loop. This is the `scss/_badge.scss` pattern:

```scss
// scss-docs-start widget-variants
$widget-variants: (
  "subtle": (
    "color": "fg",
    "bg": "bg-subtle",
    "border-color": "transparent"
  ),
  "outline": (
    "color": "fg",
    "bg": "transparent",
    "border-color": "border"
  )
) !default;
// scss-docs-end widget-variants

@layer components {
  // scss-docs-start widget-variant-loop
  @each $variant, $properties in $widget-variants {
    .widget-#{$variant} {
      @each $property, $value in $properties {
        @if $value == "transparent" {
          --widget-#{$property}: transparent;
        } @else {
          --widget-#{$property}: var(--theme-#{$value});
        }
      }
    }
  }
  // scss-docs-end widget-variant-loop
}
```

Mapping to theme sub-keys rather than literal colors is what lets `.widget-outline.theme-success` work without a variant-per-color explosion.

Sizes follow the button pattern: a list run through `defaults()`, looped into classes that re-point the component's tokens at the shared `--btn-input-<size>-*` scale.

```scss
$widget-sizes: () !default;
$widget-sizes: defaults(
  ("sm", "lg"),
  $widget-sizes
);
```

`defaults()` turns a list into a map, so a project can drop a size with `$widget-sizes: ("sm": null)` or add its own.

---

## Step 5: Wire up theme colors

Theme classes (`.theme-primary`, `.theme-danger`, …) are generated from `$theme-colors` and set a fixed set of variables: `--theme-base`, `--theme-fg`, `--theme-fg-emphasis`, `--theme-bg`, `--theme-bg-subtle`, `--theme-bg-muted`, `--theme-border`, `--theme-focus-ring`, and `--theme-contrast`.

A component gets theme support for free by reading those variables with a neutral fallback, which is why the defaults in Step 2 look like this:

```scss
--widget-color: var(--theme-fg, inherit),
--widget-bg: var(--theme-bg-subtle, var(--bg-1)),
--widget-border-color: var(--theme-border, var(--border-color)),
```

Unthemed markup uses the fallbacks; adding a theme class recolors the component with no extra CSS:

```html
<div class="widget theme-danger">…</div>
```

Do not hardcode `var(--red-500)` or a specific theme color in component tokens. Adding or overriding theme colors themselves is covered by the `bootstrap-color-system` skill.

---

## Step 6: Markup and accessibility

- Start from the semantic element. Add ARIA only where the markup can't convey meaning on its own — for example `role="alert"` on a live message, `aria-expanded` on a disclosure trigger.
- Interactive parts must be reachable by keyboard and show a visible focus ring. The `.focus-ring` helper applies `outline: var(--focus-ring-width) solid var(--theme-focus-ring, var(--focus-ring-color))` on `:focus-visible`; theme-aware components inherit the right color automatically.
- Give icon-only controls an accessible name with `.visually-hidden` text or `aria-label`.
- Never signal state through color alone; pair it with text, an icon, or an ARIA attribute.
- Keep the markup RTL-safe: logical properties in CSS, no left/right assumptions in the DOM order.

---

## Step 7: Register the partial

Forward the partial from `scss/bootstrap.scss` in the components block, keeping the existing ordering:

```scss
@forward "widget";
```

Components that live in a subdirectory (`scss/buttons/`, `scss/forms/`, `scss/helpers/`) are forwarded from that directory's `index.scss` barrel, and the barrel is forwarded from `scss/bootstrap.scss`. Add new files to the barrel, not to `bootstrap.scss`, in that case.

---

## Step 8: Document the component

1. Add `site/src/content/docs/components/<name>.mdx`:

   ```markdown
   ---
   title: Widget
   description: Documentation and examples for Bootstrap’s widget component.
   toc: true
   css_layer: components
   ---
   ```

   Add `js: optional` (or `js: required`) when the component ships a JavaScript plugin.

2. Add an entry to `site/data/sidebar.yml` under the Components section. The sidebar drives the nav, the page ordering, and inclusion in `llms.txt`, so a page without an entry is effectively invisible:

   ```yaml
   - title: Widget
     meta:
       - added: 6.0.0
   ```

3. Show usage with `<Example>` for live demos, and render the token map under a `### Variables` section:

   ```markdown
   <CSSVariables component="Widgets" className="widget" />

   <ScssDocs name="widget-tokens" file="scss/_widget.scss" />
   ```

4. Link internally with `[[docsref:/components/widget/]]` rather than a hardcoded versioned path.

---

## Step 9: Verify

1. `npm run css-lint` — catches disallowed properties, wrong declaration order, and missing logical properties.
2. `npm run css` — compiles, prefixes, and minifies. Confirm the tokens land in `dist/css/bootstrap.css` with the `--bs-` prefix.
3. `npm run docs-build` — fails on a broken `docsref`, a missing sidebar entry, or missing `scss-docs` markers.
4. Check the component in the browser: with and without a theme class, in both color modes, with `dir="rtl"` on `<html>` (v6 has no separate RTL stylesheet — logical properties do the work), and with reduced motion enabled if it animates.

---

## In your own project

The same pattern works for your own components on top of Bootstrap. In `custom.scss`, `@use` the pieces you need and follow Steps 2–6 unchanged:

```scss
@use "bootstrap/scss/config" as *;
@use "bootstrap/scss/mixins/tokens" as *;
@use "bootstrap/scss/bootstrap";

$widget-tokens: () !default;
$widget-tokens: defaults(
  (
    --widget-bg: var(--theme-bg-subtle, var(--bg-1)),
  ),
  $widget-tokens
);

@layer custom {
  .widget {
    @include tokens($widget-tokens);
    background-color: var(--widget-bg);
  }
}
```

Use the `custom` layer, which sits after `components` and before `helpers` and `utilities`, so your styles win over component defaults while utilities still override yours. Retuning an existing Bootstrap component doesn't require any of this — override its CSS variables at runtime, or pass its `$*-tokens` map through `with ()` at compile time.
