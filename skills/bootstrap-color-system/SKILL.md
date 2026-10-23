---
name: bootstrap-color-system
description: Work with Bootstrap 6's color system in Sass and CSS. Use when customizing colors, adding or overriding theme colors, working with color modes, or using the color scales, semantic tokens, and theme classes.
guide: /customize/color
---

# Bootstrap 6 color system

Bootstrap 6 colors flow through a fixed pipeline: a handful of `oklch()` hues become full scales, a subset of those scales gets semantic roles, and components read the roles — never the hues. Customizing colors means picking the right layer to change, so start by identifying which one your task belongs to.

## Workflow

- [ ] Step 1: Locate the layer you need to change
- [ ] Step 2: Base hues and scales
- [ ] Step 3: Theme colors
- [ ] Step 4: Layer colors for backgrounds, foregrounds, and borders
- [ ] Step 5: Color modes
- [ ] Step 6: Compile-time overrides
- [ ] Step 7: Runtime overrides
- [ ] Step 8: Functions and utilities
- [ ] Step 9: Verify

---

## Step 1: Locate the layer you need to change

The pipeline, with the file that owns each stage:

1. **Base hues** — `scss/_colors.scss` defines 16 hues as `oklch()` scalars and collects them in `$colors`.
2. **Color scales** — the same file derives steps `025`–`975` from each hue with `color-mix()`, emitting `--blue-500`, `--red-200`, and so on into `:root`.
3. **Theme colors** — `scss/_theme.scss` maps semantic names (`primary`, `danger`, …) onto those scale tokens, one role at a time.
4. **Root tokens** — `scss/_root.scss` emits every theme role as `--<name>-<role>` (`--danger-bg-subtle`) plus the layer color tokens.
5. **Theme classes** — `scss/helpers/_theme-colors.scss` outputs `.theme-<name>` in `@layer helpers`, remapping `--<name>-<role>` onto the generic `--theme-<role>`.
6. **Components and utilities** — read `--theme-*` (with a neutral fallback) and the layer tokens. Nothing reads a raw hue.

Match the task to the layer: a different brand blue is stage 1, a new semantic color is stage 3, restyling one component is a component token (see the `bootstrap-component` skill), and a one-off tweak in an app is a runtime CSS variable override.

---

## Step 2: Base hues and scales

Each hue is a single `oklch()` value that anchors step 500:

```scss
$blue: oklch(60% 0.24 240) !default;
```

The 16 hues are blue, indigo, violet, purple, pink, red, orange, amber, yellow, lime, green, teal, cyan, brown, gray, and pewter, plus `$white` and `$black`. `$colors` collects them through `defaults()`, so the map merges rather than replaces.

Scales are generated, not hand-picked. Every hue is mixed toward `$tint-color` (`var(--white)`) for steps `025 050 100 200 300 400` and toward `$shade-color` (`var(--black)`) for `600 700 800 900 950 975`, in the `$color-mix-space` color space (`lab`). Change a hue and its whole scale re-derives.

Add a hue by merging into `$colors` — you get its full scale and any color utilities built from `$colors` automatically:

```scss
@use "bootstrap/scss/bootstrap" with (
  $colors: (
    "slate": oklch(55% 0.04 250),
  )
);
```

Tint and shade percentages (`$color-tints`, `$color-shades`), the mixing space, and the mix targets are all configurable the same way. Individual steps can be overridden through `$color-tokens`.

Mixing happens against `var(--white)` / `var(--black)` on purpose: it keeps `color-mix()` live in the output instead of letting the CSS minifier flatten it into static `lab()` values.

---

## Step 3: Theme colors

`$theme-colors` in `scss/_theme.scss` defines eight semantic colors — `primary`, `accent`, `success`, `danger`, `warning`, `info`, `inverse`, `secondary` — each a nested map of nine roles:

| Role | What it's for |
| --- | --- |
| `base` | The raw brand color the rest is derived from |
| `bg` | Solid background, e.g. a solid button or badge |
| `bg-subtle` | Tinted surface for alerts, subtle buttons, callouts |
| `bg-muted` | One step stronger than subtle |
| `fg` | Text on a subtle surface |
| `fg-emphasis` | Higher-contrast text on a subtle surface |
| `contrast` | Text and icons sitting on `base` / `bg` |
| `border` | Borders on subtle surfaces |
| `focus-ring` | Focus outline color |

Most roles are `light-dark(…)` pairs, and every value is a `var()` reference to a scale token rather than a literal color:

```scss
"danger": (
  "base": var(--red-500),
  "fg": light-dark(var(--red-600), var(--red-400)),
  "bg-subtle": light-dark(var(--red-100), var(--red-900)),
  "border": light-dark(var(--red-300), var(--red-600)),
  "contrast": var(--white)
),
```

The map produces two things: `--danger-fg`-style tokens on `:root, :host`, and a `.theme-danger` class that assigns them to the generic `--theme-fg`, `--theme-bg-subtle`, and friends. That indirection is the whole point — a component written against `--theme-*` supports every color, current and future, with one rule.

Use `.theme-reset` on a nested subtree to set those `--theme-*` tokens to `initial` and return children to their component defaults.

The `primary`, `success`, and `danger` keys are required; other code (links, focus rings, form states, checked controls) reads their tokens. Renaming or removing them breaks the build.

---

## Step 4: Layer colors for backgrounds, foregrounds, and borders

Neutral surfaces don't live in `$theme-colors`. Three separate maps in `scss/_theme.scss` cover them:

- `$theme-bgs` → `--bg-body`, `--bg-1` through `--bg-4` (increasingly contrasty surfaces), plus `--bg-white`, `--bg-black`, `--bg-transparent`.
- `$theme-fgs` → `--fg-body`, `--fg-1` through `--fg-4` (decreasing emphasis).
- `$theme-borders` → `--border-body`, `--border-subtle`, `--border-muted`, `--border-emphasized`.

Use these as the *unthemed* fallbacks in component tokens: `var(--theme-bg-subtle, var(--bg-1))`, `var(--theme-border, var(--border-color))`. Note that `--border-color` is a separate global token in `$root-tokens` — the default border color for components — distinct from this `--border-*` family.

Unlike `$theme-colors`, these are flat maps, which makes them easy to extend with an extra surface step. All four maps merge through `defaults()`, so pass only the keys you are changing.

---

## Step 5: Color modes

Bootstrap 6 does not redeclare variables per mode. Every adaptive token is a `light-dark()` pair, and CSS resolves it from the inherited `color-scheme`:

- `:root, :host` sets `color-scheme: light dark`, so the default is whatever the OS prefers.
- `[data-bs-theme="dark"]` and `[data-bs-theme="light"]` set `color-scheme` on that subtree, forcing a mode. It works on any element, nests, and needs no JavaScript.

So switching modes is a matter of setting one attribute, and authoring adaptive colors is a matter of using `light-dark()` instead of writing a dark-mode override block.

Two mixins exist for the cases `light-dark()` can't cover:

```scss
// Non-color values can't go through light-dark()
@include color-mode(dark, $root: true) {
  --shadow-strength: 2.4;
}
```

`color-mode($mode, $root)` honors the `$color-mode-type` config, which defaults to `"media-query"` (emitting `@media (prefers-color-scheme: …)`); set it to `"data"` to emit `[data-bs-theme="…"]` selectors instead. `color-scheme($name)` is the plain media-query wrapper when you always want the query.

Custom modes work the same way: add your own `[data-bs-theme="blue"]` selector and override tokens inside it.

---

## Step 6: Compile-time overrides

Maps built with `defaults()` — `$colors`, `$color-tokens`, `$root-tokens`, `$theme-colors`, `$theme-bgs`, `$theme-fgs`, `$theme-borders`, and every component `$*-tokens` — **merge**. Pass only the keys you're changing, and pass `null` to remove one.

Nested theme-color maps merge one level deep. To change one role of a built-in theme, pass the whole sub-map for that theme. A partial sub-map replaces the theme's other roles.

Retuning an existing theme color is still easiest one layer down — change the hue and everything derived from it follows:

```scss
@use "bootstrap/scss/bootstrap" with (
  $blue: oklch(58% 0.21 250)
);
```

To add or restyle a theme color, pass a partial `$theme-colors` map through the main entrypoint. `defaults()` keeps the built-ins. Keep `primary`, `success`, and `danger` unless you replace their whole sub-map:

```scss
@use "bootstrap/scss/bootstrap" with (
  $theme-colors: (
    "brand": (
      "base": var(--indigo-500),
      "fg": light-dark(var(--indigo-600), var(--indigo-400)),
      "fg-emphasis": light-dark(var(--indigo-800), var(--indigo-300)),
      "bg": var(--indigo-500),
      "bg-subtle": light-dark(var(--indigo-100), var(--indigo-900)),
      "bg-muted": light-dark(var(--indigo-200), var(--indigo-800)),
      "border": light-dark(var(--indigo-300), var(--indigo-600)),
      "focus-ring": light-dark(color-mix(in oklch, var(--indigo-500) 50%, var(--bg-body)), color-mix(in oklch, var(--indigo-500) 75%, var(--bg-body))),
      "contrast": var(--white)
    )
  )
);
```

When all you want is *one more* theme color without utilities, skip the Sass config and write the class yourself. Components only care about the `--theme-*` tokens:

```scss
@layer helpers {
  .theme-brand {
    --theme-base: var(--purple-500);
    --theme-bg: var(--purple-500);
    --theme-bg-subtle: light-dark(var(--purple-100), var(--purple-900));
    --theme-fg: light-dark(var(--purple-600), var(--purple-400));
    --theme-border: light-dark(var(--purple-300), var(--purple-600));
    --theme-contrast: var(--white);
  }
}
```

`.theme-brand` then works on every theme-aware component. The trade-off: utilities and `--brand-*` root tokens are generated from `$theme-colors`, so `.bg-brand` and `var(--brand-bg)` won't exist.

---

## Step 7: Runtime overrides

Every token is a CSS custom property, so most color changes need no recompile at all:

```css
/* Global — repeat on :host if you adopt the stylesheet in a shadow root */
:root,
:host {
  --bs-primary-bg-subtle: #eef2ff;
}

/* One subtree */
.marketing-hero {
  --bs-theme-bg-subtle: #eef2ff;
}
```

Token names are written **unprefixed** in Sass (`--primary-bg-subtle`). Bootstrap's dist and CDN CSS run PostCSS to add the `--bs-` prefix, so use `--bs-*` when overriding the shipped CSS and unprefixed names when you compile the source yourself.

Runtime overrides are the right tool for per-page or per-tenant theming; compile-time config is for changing the system's defaults.

---

## Step 8: Functions and utilities

Helpers in `scss/_theme.scss` for reading across the color maps, mostly used when generating utilities:

- `theme-color-values($role)` — flat map of color name to the raw value of that role.
- `theme-color-refs($role)` — same, but as `var(--<name>-<role>)` references.
- `theme-token-refs($map, $prefix)` — the equivalent for the layer color maps.
- `theme-opacity-values($var, $fallback)` — an opacity ladder built with `color-mix()` against `transparent`.

`color-contrast($background)` in `scss/_functions.scss` returns a light, dark, or black foreground using the WCAG contrast algorithm. It works on Sass color values, not `var()` references, so it's for build-time swatches and generated classes — the `contrast` role in `$theme-colors` is the runtime answer.

The generated utilities follow the role names: `.fg-primary`, `.fg-emphasis-primary`, `.fg-contrast-primary`, `.bg-primary`, `.bg-subtle-primary`, `.bg-muted-primary`, `.border-primary`, and `.border-subtle-primary`, for every theme color. The layer colors get the same treatment (`.bg-1` through `.bg-4`, `.fg-1` through `.fg-4`, `.border-subtle`), and opacity is a numeric ladder on the same class names — `.fg-50`, `.bg-70`, `.border-30`, in steps of 10.

Reach for `.theme-*` instead when you want a whole element themed rather than one property recolored.

---

## Step 9: Verify

1. `npm run css-lint`, then `npm run css`.
2. Grep the compiled `dist/css/bootstrap.css` for the tokens you expected (`--bs-primary-bg-subtle`, `--bs-slate-500`) to confirm they were emitted.
3. Check both color modes: OS preference, `data-bs-theme="dark"`, and a nested `data-bs-theme="light"` inside it.
4. Verify contrast for any new theme color — at minimum `contrast` on `bg`, and `fg` on `bg-subtle`, in both modes.
5. If you added or removed entries in `$colors` or `$theme-colors`, confirm the generated utilities and `.theme-*` classes changed accordingly, and that `npm run docs-build` still passes (the docs render swatches from these maps).
