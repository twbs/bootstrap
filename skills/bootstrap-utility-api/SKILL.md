---
name: bootstrap-utility-api
description: Use, extend, and customize Bootstrap 6's utility API. Use when adding a custom utility class, modifying or removing Bootstrap's default utilities, enabling responsive or state variants, or trimming the generated utility CSS.
guide: /utilities/api
---

# Bootstrap 6 utility API

Every utility class Bootstrap ships is generated from one Sass map, `$utilities`. Each entry describes a family of classes — the property it sets, the values it accepts, and which variants to generate. Customizing utilities means editing that map, not writing CSS.

## Workflow

- [ ] Step 1: Understand how generation works
- [ ] Step 2: Read a utility definition
- [ ] Step 3: Add a utility
- [ ] Step 4: Modify, rename, or remove a default utility
- [ ] Step 5: Generate responsive, state, print, and dark variants
- [ ] Step 6: Compose values with custom properties and advanced selectors
- [ ] Step 7: Trim the generated CSS
- [ ] Step 8: Add a utility to Bootstrap itself
- [ ] Step 9: Verify

---

## Step 1: Understand how generation works

`scss/utilities/_api.scss` is the whole pipeline:

```scss
@include generate-utility-at-properties($utilities);

@layer utilities {
  @include generate-utilities-loop($utilities, $breakpoints);
}
```

Three consequences worth knowing before you touch anything:

- **Utilities are the last cascade layer**, so they win over component styles without needing `!important`. Only groups that opt in with `important: true` add it.
- **`@property` registration happens outside the layer.** Every custom property a utility assigns (`--bg`, `--fg`, `--bc`, `--rounded-size`, …) is registered with `syntax: "*"; inherits: false`, so applying `.border-inverse` doesn't leak its composed value into descendants. New utilities that assign custom properties get this automatically.
- **The map is configured on the `config` module, not `bootstrap`.** `$utilities` is declared in `scss/_config.scss` and only *populated* in `scss/_utilities.scss` (which loads config with `@use "config" as *`). Configuring the wrong module fails:

```scss
// Does NOT work — "This variable was not declared with !default in the @used module."
@use "bootstrap/scss/bootstrap" with (
  $utilities: (…)
);

// Works — configure config first, then load Bootstrap
@use "bootstrap/scss/config" with (
  $utilities: (…)
);
@use "bootstrap/scss/bootstrap";
```

The same applies to any variable that lives in `_config.scss` (`$radius`, `$spacers`, `$breakpoints`, `$zindex-levels`). Variables declared in a partial that `bootstrap.scss` forwards — `$root-tokens`, `$colors`, `$blue` — can be configured on `bootstrap` directly.

---

## Step 2: Read a utility definition

A group is a map. The simplest form needs two keys:

```scss
"overflow": (
  property: overflow,
  values: auto hidden visible scroll,
),
```

The full option set, as validated by `generate-utility()`:

| Key | Required | What it does |
| --- | --- | --- |
| `property` | Yes | Property name, space-separated list of names, or a map of property-to-value pairs |
| `values` | Yes | List (class suffix equals the value) or map (keys become suffixes; a `null` key omits the suffix) |
| `class` | No | Class name to use instead of the property name |
| `selector` | No | `class` (default), `attr-starts`, or `attr-includes` |
| `child-selector` | No | Descendant selector, wrapped in `:where()` for zero specificity |
| `variables` | No | Custom properties to emit — a map of static values, or a list that each receive the utility value |
| `state` | No | Pseudo-class variants to generate, e.g. `hover focus` |
| `responsive` | No | Generate a class per breakpoint (default `false`) |
| `print` | No | Generate `print:`-prefixed classes (default `false`) |
| `dark` | No | Generate `dark:`-prefixed classes inside `prefers-color-scheme: dark` (default `false`) |
| `important` | No | Append `!important` (default `false`) |
| `enabled` | No | Set `false` to suppress output while keeping the definition (default `true`) |

The generator validates as it goes, which makes mistakes cheap to find: a missing `property` or `values` is a hard `@error`, a non-boolean `responsive` is a hard `@error`, and a misspelled key is a `@warn` listing the valid ones.

---

## Step 3: Add a utility

Your map is merged over Bootstrap's defaults, so pass only what's new:

```scss
@use "bootstrap/scss/config" with (
  $utilities: (
    "cursor": (
      property: cursor,
      class: cursor,
      responsive: true,
      values: auto pointer grab,
    ),
  )
);
@use "bootstrap/scss/bootstrap";
```

That yields `.cursor-auto`, `.cursor-pointer`, `.cursor-grab`, plus `.sm:cursor-*` through `.2xl:cursor-*`.

Value shapes control the class names:

```scss
// List — suffix is the value itself: .cursor-pointer
values: auto pointer grab,

// Map — keys become suffixes: .tint-brand
values: (brand: var(--purple-500), muted: var(--gray-200)),

// null key — no suffix at all: .shout
values: (null: uppercase),
```

---

## Step 4: Modify, rename, or remove a default utility

The merge is **shallow**: supplying an existing group key replaces that entire group. Overriding one option and omitting the rest fails loudly —

```scss
// Errors: "Utility is missing required `property` key"
"overflow": (
  responsive: true,
  values: visible hidden scroll auto,
),
```

so copy the full definition from `scss/_utilities.scss` and add your change:

```scss
@use "bootstrap/scss/config" with (
  $utilities: (
    // Make overflow responsive
    "overflow": (
      property: overflow,
      values: auto hidden visible scroll,
      responsive: true,
    ),
    // Remove a family entirely
    "width": null,
    // Rename .ms-* to v4-style .ml-*: drop the original, add a replacement
    "margin-start": null,
    "margin-start-alias": (
      property: margin-inline-start,
      class: ml,
      responsive: true,
      values: (0: 0, 1: var(--spacer-1), 2: var(--spacer-2), auto: auto),
    ),
  )
);
@use "bootstrap/scss/bootstrap";
```

Note the CSS tokens in that last group. The file configuring `config` can't read Bootstrap's Sass members — `$spacers`, `$negative-spacers`, and helpers like `map-merge-multiple()` aren't in scope yet — so restate values as CSS tokens (`var(--spacer-2)`, which tracks the spacer scale) or as literals.

To *extend* an existing family without copying its definition, register a new group that reuses the same `class`:

```scss
"width-extra": (
  property: width,
  class: w,
  responsive: true,
  values: (10: 10%, 15: 15%),
),
```

This adds `.w-10` and `.w-15` next to Bootstrap's `.w-25` … `.w-100`, and is usually the better choice — it survives Bootstrap updates that change the original group.

Prefer `enabled: false` over `null` when you want the definition to stay visible in the map (useful in a shared config where the group is documented but intentionally off).

---

## Step 5: Generate responsive, state, print, and dark variants

v6 uses **prefixes**, not infixes or suffixes. All four variant types compose with the base class name:

| Option | Generated class | Notes |
| --- | --- | --- |
| `responsive: true` | `.md:cursor-pointer` | One pass per key in `$breakpoints`; written `.md\:` in the CSS |
| `state: hover focus` | `.hover:cursor-pointer` | Selector is `.hover\:cursor-pointer:hover` |
| `print: true` | `.print:d-none` | Wrapped in `@media print` |
| `dark: true` | `.dark:bg-black` | Wrapped in `@media (prefers-color-scheme: dark)` |

`responsive` and `state` stack, producing `.md:hover:cursor-pointer`. Each variant multiplies the generated CSS, so enable them per group rather than globally.

---

## Step 6: Compose values with custom properties and advanced selectors

Most color-ish utilities don't set the property directly. They assign a local custom property and then consume it, which is what makes opacity and composition work:

```scss
"tint": (
  property: (
    "--tint": null,
    "background-color": var(--tint),
  ),
  class: tint,
  values: (brand: var(--purple-500)),
),
```

A `null` value in the property map means "receive the utility's value"; every other entry is emitted as written. The above generates:

```css
.tint-brand {
  --tint: var(--purple-500);
  background-color: var(--tint);
}
```

Related mechanics:

- **`variables`** emits extra custom properties. As a map, each gets a static value on every class in the group; as a list, each receives the utility's value.
- **Property maps plus map values.** When `property` is a map and a `values` entry is itself a map keyed by property name, each property picks its own value — useful for a group that sets several related properties at different values.
- **`selector: attr-starts` / `attr-includes`** targets `[class^="…"]` / `[class*="…"]` instead of a class, and requires a `class` key. Bootstrap uses it so `.ratio-16x9` can feed `aspect-ratio` through `--ratio`.
- **`child-selector`** wraps the rule in `:where()`, e.g. `:where(.stack-gap-1 > *)`. Zero specificity means a child's own styles still win.

Custom property names are written **unprefixed** in Sass. Bootstrap's dist and CDN CSS run PostCSS to add `--bs-`, so compiling the source yourself keeps them unprefixed.

---

## Step 7: Trim the generated CSS

Utilities are the biggest slice of Bootstrap's CSS, and the map is the cheapest place to cut:

1. Start from the utilities-only entry point if you don't need components:

   ```scss
   @use "bootstrap/scss/config" with ($utilities: (…));
   @use "bootstrap/scss/bootstrap-utilities";
   ```

2. Set unused groups to `null` (or `enabled: false`) rather than relying on the minifier or a purge step.
3. Turn `responsive` off on groups you only use at one breakpoint — a responsive group costs six copies of itself.
4. Narrow `values` maps instead of deleting whole groups when you only need a few steps.

See [Optimize]([[docsref:/customize/optimize/]]) for the wider picture, including Lightning CSS and purging.

---

## Step 8: Add a utility to Bootstrap itself

When contributing a utility to the framework rather than a project:

1. Add the group to the `$utilities` map in `scss/_utilities.scss`, near related groups, wrapped in `// scss-docs-start utils-<name>` / `// scss-docs-end utils-<name>` markers.
2. Prefer composing through a custom property when the utility should interact with opacity or theme colors, and reuse existing token values (`$spacers`, `$util-opacity`, `theme-color-refs()`) instead of literals.
3. Document it on the matching page in `site/src/content/docs/utilities/`, rendering the definition with `<ScssDocs name="utils-<name>" file="scss/_utilities.scss" />`, and add a `site/data/sidebar.yml` entry if the page is new.
4. Add coverage in `scss/tests/utilities/_api.test.scss`, which calls the generator mixins directly with a fixture map.
5. Run `npm run css`. Its `css-docs` step regenerates `dist/css/bootstrap-utilities.metadata.json`, which the docs read — commit it alongside your change.

---

## Step 9: Verify

1. `npm run css-lint`, then `npm run css`.
2. Grep the compiled CSS for the classes you expected, including the escaped variants (`\.md\\:cursor-pointer`), and confirm nothing you removed is still present.
3. Confirm new custom properties appear in the `@property` block at the top of the file — if one is missing, the utility isn't assigning it through `property` or `variables`.
4. Watch the Sass output for `@warn` lines about unknown keys; they're the fastest signal that an option was misspelled and silently ignored.
5. Check specificity in the browser: utilities should override component styles through the layer order alone, without `!important`.
