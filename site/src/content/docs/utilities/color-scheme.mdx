---
title: Color scheme
description: Set the color scheme of a single element to control how the browser paints form controls, scrollbars, and embedded documents.
toc: true
mdn: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
utility:
  - color-scheme
---

The `color-scheme` property tells the browser which color schemes an element supports. The browser then paints its own parts to match. This includes native form controls, scrollbars, and the canvas behind an `<iframe>`.

Bootstrap sets `color-scheme` for you. Reboot sets `light dark` on `:root`, and each `data-bs-theme` value pins one scheme. Use these utilities when one element must use a different scheme than the rest of the page.

## Light and dark

Add `.color-scheme-light` or `.color-scheme-dark` to set the scheme of one element. The browser then paints the native parts of that element to match. The example below forces a light date picker inside a dark theme.

<Example code={`<div class="p-3 bg-body fg-body" data-bs-theme="dark">
    <label class="form-label" for="scheme-dark-date">Dark picker (inherited)</label>
    <input class="form-control mb-3" id="scheme-dark-date" type="date">
    <label class="form-label" for="scheme-light-date">Light picker</label>
    <input class="form-control color-scheme-light" id="scheme-light-date" type="date">
  </div>`} />

Add the class to the element that needs it. Do not add it to a wrapper.

<Callout type="warning">
These utilities also change the Bootstrap colors of an element and its children. We resolve our color tokens with `light-dark()`, which reads the used `color-scheme`. A `.color-scheme-light` wrapper inside a dark theme therefore gives its children dark text on the dark background. The utilities also leave `--shadow-strength` unchanged, so the shadows keep the strength of the parent theme.

Use `data-bs-theme` to switch a whole subtree, because it sets both the color scheme and the shadow strength. Read [Color modes]([[docsref:/customize/color-modes]]) for more information.
</Callout>

## Follow the system preference

Add `.color-scheme-auto` to make an element support both schemes. The browser then follows the system preference for that element, also when `data-bs-theme` forces a theme.

```html
<iframe class="color-scheme-auto" src="..."></iframe>
```

The warning above applies here too. Our colors follow the system preference inside this element, and no longer the theme you forced.

## Third-party embeds

An embedded document follows the system preference. It cannot see the `data-bs-theme` attribute of the parent page. Reboot therefore sets `color-scheme: light dark` on every `<iframe>`, which keeps the embed transparent. Read [Reboot]([[docsref:/content/reboot#iframe-color-scheme]]) for the full explanation.

Some third-party embeds have no dark mode. The browser paints a white background behind such an embed when the system is in dark mode. Add `.color-scheme-light` to that one iframe to make the background transparent again.

```html
<iframe class="color-scheme-light" src="..."></iframe>
```

<Callout type="warning">
Use `.color-scheme-light` only for an embed that has no dark mode. Safari and Firefox apply the value to the embedded document. An embed that has its own dark mode then shows in light mode.
</Callout>

## Add more values

We ship three values, because they cover the cases above. CSS has more, such as `normal` and `only light`. We do not ship them, because they are hazardous on an `<iframe>`. Safari and Firefox apply them to the embedded document and remove its dark mode, and `light` does the same job with a clearer name.

Add the values you need with the [utilities API]([[docsref:/utilities/api#override-utilities]]). Restate the three default values, because your group replaces ours:

```scss
// my-bootstrap.scss
@use "bootstrap/scss/bootstrap" with (
  $utilities: (
    "color-scheme": (
      property: color-scheme,
      class: color-scheme,
      values: (
        light: light,
        dark: dark,
        auto: light dark,
        normal: normal,
        only-light: only light
      )
    )
  )
);
```

This adds `.color-scheme-normal` and `.color-scheme-only-light` to the three default classes.

## CSS

### Sass utilities API

Color scheme utilities are declared in our utilities API in `scss/_utilities.scss`. [Learn how to use the utilities API.]([[docsref:/utilities/api#using-the-api]])

<ScssDocs name="utils-color-scheme" file="scss/_utilities.scss" />
