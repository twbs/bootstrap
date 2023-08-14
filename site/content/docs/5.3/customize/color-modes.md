---
layout: docs
title: Color modes
description: Bootstrap now supports color modes, or themes, as of v5.3.0. Explore our default light color mode and the new dark mode, or create your own using our styles as your template.
group: customize
toc: true
added: "5.3"
---

{{< callout >}}
**Try it yourself!** Download the source code and working demo for using Bootstrap with Stylelint, and the color modes from the [twbs/examples repository](https://github.com/twbs/examples/tree/main/color-modes). You can also [open the example in StackBlitz](https://stackblitz.com/github/twbs/examples/tree/main/color-modes?file=index.html).
{{< /callout >}}

## Dark mode

**Bootstrap now supports color modes, starting with dark mode!** With v5.3.0 you can implement your own color mode toggler (see below for an example from Bootstrap's docs) and apply the different color modes as you see fit. We support a light mode (default) and now dark mode. Color modes can be toggled globally on the `<html>` element, or on specific components and elements, thanks to the `data-bs-theme` attribute.

Alternatively, you can also switch to a media query implementation thanks to our color mode mixin—see [the usage section for details](#building-with-sass). Heads up though—this eliminates your ability to change themes on a per-component basis as shown below.

## Example

For example, to change the color mode of a dropdown menu, add `data-bs-theme="light"` or `data-bs-theme="dark"` to the parent `.dropdown`. Now, no matter the global color mode, these dropdowns will display with the specified theme value.

{{< example class="d-flex justify-content-between" >}}
<div class="dropdown" data-bs-theme="light">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonLight" data-bs-toggle="dropdown" aria-expanded="false">
    Default dropdown
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonLight">
    <li><a class="dropdown-item active" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
</div>

<div class="dropdown" data-bs-theme="dark">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonDark" data-bs-toggle="dropdown" aria-expanded="false">
    Dark dropdown
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonDark">
    <li><a class="dropdown-item active" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
</div>
{{< /example >}}

## How it works

- As shown above, color mode styles are controlled by the `data-bs-theme` attribute. This attribute can be applied to the `<html>` element, or to any other element or Bootstrap component. If applied to the `<html>` element, it will apply to everything. If applied to a component or element, it will be scoped to that specific component or element.

- For each color mode you wish to support, you'll need to add new overrides for the shared global CSS variables. We do this already in our `_root.scss` stylesheet for dark mode, with light mode being the default values. In writing color mode specific styles, use the mixin:

  ```scss
  // Color mode variables in _root.scss
  @include color-mode(dark) {
    // CSS variable overrides here...
  }
  ```

- We use a custom `_variables-dark.scss` to power those shared global CSS variable overrides for dark mode. This file isn't required for your own custom color modes, but it's required for our dark mode for two reasons. First, it's better to have a single place to reset global colors. Second, some Sass variables had to be overridden for background images embedded in our CSS for accordions, form components, and more.

## Usage

### Enable dark mode

Enable the built in dark color mode across your entire project by adding the `data-bs-theme="dark"` attribute to the `<html>` element. This will apply the dark color mode to all components and elements, other than those with a specific `data-bs-theme` attribute applied. Building on the [quick start template]({{< docsref "/getting-started/introduction#quick-start" >}}):

```html
<!doctype html>
<html lang="en" data-bs-theme="dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="{{< param "cdn.css" >}}" rel="stylesheet" integrity="{{< param "cdn.css_hash" >}}" crossorigin="anonymous">
  </head>
  <body>
    <h1>Hello, world!</h1>
    <script src="{{< param "cdn.js_bundle" >}}" integrity="{{< param "cdn.js_bundle_hash" >}}" crossorigin="anonymous"></script>
  </body>
</html>
```

Bootstrap does not yet ship with a built-in color mode picker, but you can use the one from our own documentation if you like. [Learn more in the JavaScript section.](#javascript)

### Building with Sass

Our new dark mode option is available to use for all users of Bootstrap, but it's controlled via data attributes instead of media queries and does not automatically toggle your project's color mode. You can disable our dark mode entirely via Sass by changing `$enable-dark-mode` to `false`.

We use a custom Sass mixin, `color-mode()`, to help you control _how_ color modes are applied. By default, we use a `data` attribute approach, allowing you to create more user-friendly experiences where your visitors can choose to have an automatic dark mode or control their preference (like in our own docs here). This is also an easy and scalable way to add different themes and more custom color modes beyond light and dark.

In case you want to use media queries and only make color modes automatic, you can change the mixin's default type via Sass variable. Consider the following snippet and its compiled CSS output.

```scss
$color-mode-type: data;

@include color-mode(dark) {
  .element {
    color: var(--bs-primary-text-emphasis);
    background-color: var(--bs-primary-bg-subtle);
  }
}
```

Outputs to:

```css
[data-bs-theme=dark] .element {
  color: var(--bs-primary-text-emphasis);
  background-color: var(--bs-primary-bg-subtle);
}
```

And when setting to `media-query`:

```scss
$color-mode-type: media-query;

@include color-mode(dark) {
  .element {
    color: var(--bs-primary-text-emphasis);
    background-color: var(--bs-primary-bg-subtle);
  }
}
```

Outputs to:

```css
@media (prefers-color-scheme: dark) {
  .element {
    color: var(--bs-primary-text-emphasis);
    background-color: var(--bs-primary-bg-subtle);
  }
}
```

## Custom color modes

While the primary use case for color modes is light and dark mode, custom color modes are also possible. Create your own `data-bs-theme` selector with a custom value as the name of your color mode, then modify our Sass and CSS variables as needed. We opted to create a separate `_variables-dark.scss` stylesheet to house Bootstrap's dark mode specific Sass variables, but that's not required for you.

For example, you can create a "blue theme" with the selector `data-bs-theme="blue"`. In your custom Sass or CSS file, add the new selector and override any global or component CSS variables as needed. If you're using Sass, you can also use Sass's functions within your CSS variable overrides.

{{< scss-docs name="custom-color-mode" file="site/assets/scss/_content.scss" >}}

<div class="bd-example text-body bg-body" data-bs-theme="blue">
  <div class="h4">Example blue theme</div>
  <p>Some paragraph text to show how the blue theme might look with written copy.</p>

  <hr class="my-4">

  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonCustom" data-bs-toggle="dropdown" aria-expanded="false">
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonCustom">
      <li><a class="dropdown-item active" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
</div>

```html
<div data-bs-theme="blue">
  ...
</div>
```

## JavaScript

To allow visitors or users to toggle color modes, you'll need to create a toggle element to control the `data-bs-theme` attribute on the root element, `<html>`. We've built a toggler in our documentation that initially defers to a user's current system color mode, but provides an option to override that and pick a specific color mode.

Here's a look at the JavaScript that powers it. Feel free to inspect our own documentation navbar to see how it's implemented using HTML and CSS from our own components. It is suggested to include the JavaScript at the top of your page to reduce potential screen flickering during reloading of your site. Note that if you decide to use media queries for your color modes, your JavaScript may need to be modified or removed if you prefer an implicit control.

{{< example lang="js" show_preview="false" >}}
{{< js.inline >}}
{{- readFile (path.Join "site/static/docs" .Site.Params.docs_version "assets/js/color-modes.js") -}}
{{< /js.inline >}}
{{< /example >}}

## Adding theme colors

Adding a new color in `$theme-colors` is not enough for some of our components like [alerts]({{< docsref "/components/alerts" >}}) and [list groups]({{< docsref "/components/list-group" >}}). New colors must also be defined in `$theme-colors-text`, `$theme-colors-bg-subtle`, and `$theme-colors-border-subtle` for light theme; but also in `$theme-colors-text-dark`, `$theme-colors-bg-subtle-dark`, and `$theme-colors-border-subtle-dark` for dark theme.

This is a manual process because Sass cannot generate its own Sass variables from an existing variable or map. In future versions of Bootstrap, we'll revisit this setup to reduce the duplication.

```scss
// Required
@import "functions";
@import "variables";
@import "variables-dark";

// Add a custom color to $theme-colors
$custom-colors: (
  "custom-color": #712cf9
);
$theme-colors: map-merge($theme-colors, $custom-colors);

@import "maps";
@import "mixins";
@import "utilities";

// Add a custom color to new theme maps

// Light mode
$custom-colors-text: ("custom-color": #712cf9);
$custom-colors-bg-subtle: ("custom-color": #e1d2fe);
$custom-colors-border-subtle: ("custom-color": #bfa1fc);

$theme-colors-text: map-merge($theme-colors-text, $custom-colors-text);
$theme-colors-bg-subtle: map-merge($theme-colors-bg-subtle, $custom-colors-bg-subtle);
$theme-colors-border-subtle: map-merge($theme-colors-border-subtle, $custom-colors-border-subtle);

// Dark mode
$custom-colors-text-dark: ("custom-color": #e1d2f2);
$custom-colors-bg-subtle-dark: ("custom-color": #8951fa);
$custom-colors-border-subtle-dark: ("custom-color": #e1d2f2);

$theme-colors-text-dark: map-merge($theme-colors-text-dark, $custom-colors-text-dark);
$theme-colors-bg-subtle-dark: map-merge($theme-colors-bg-subtle-dark, $custom-colors-bg-subtle-dark);
$theme-colors-border-subtle-dark: map-merge($theme-colors-border-subtle-dark, $custom-colors-border-subtle-dark);

// Remainder of Bootstrap imports
@import "root";
@import "reboot";
// etc
```

## CSS

### Variables

Dozens of root level CSS variables are repeated as overrides for dark mode. These are scoped to the color mode selector, which defaults to `data-bs-theme` but [can be configured](#building-with-sass) to use a `prefers-color-scheme` media query. Use these variables as a guideline for generating your own new color modes.

{{< scss-docs name="root-dark-mode-vars" file="scss/_root.scss" >}}

### Sass variables

CSS variables for our dark color mode are partially generated from dark mode specific Sass variables in `_variables-dark.scss`. This also includes some custom overrides for changing the colors of embedded SVGs used throughout our components.

{{< scss-docs name="sass-dark-mode-vars" file="scss/_variables-dark.scss" >}}

### Sass mixins

Styles for dark mode, and any custom color modes you create, can be scoped appropriately to the `data-bs-theme` attribute selector or media query with the customizable `color-mode()` mixin. See the [Sass usage section](#building-with-sass) for more details.

{{< scss-docs name="color-mode-mixin" file="scss/mixins/_color-mode.scss" >}}
