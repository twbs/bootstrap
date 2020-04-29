---
layout: docs
title: Sass
description: Utilize our source Sass files to take advantage of variables, maps, mixins, and functions to help you build faster and customize your project.
group: customize
toc: true
---

Utilize our source Sass files to take advantage of variables, maps, mixins, and more. In our build we've increased the Sass rounding precision to 6 (by default it's 5) to prevent issues with browser rounding.

## File structure

Whenever possible, avoid modifying Bootstrap's core files. For Sass, that means creating your own stylesheet that imports Bootstrap so you can modify and extend it. Assuming you're using a package manager like npm, you'll have a file structure that looks like this:

{{< highlight text >}}
your-project/
├── scss
│   └── custom.scss
└── node_modules/
    └── bootstrap
        ├── js
        └── scss
{{< /highlight >}}

If you've downloaded our source files and aren't using a package manager, you'll want to manually setup something similar to that structure, keeping Bootstrap's source files separate from your own.

{{< highlight text >}}
your-project/
├── scss
│   └── custom.scss
└── bootstrap/
    ├── js
    └── scss
{{< /highlight >}}

## Importing

In your `custom.scss`, you'll import Bootstrap's source Sass files. You have two options: include all of Bootstrap, or pick the parts you need. We encourage the latter, though be aware there are some requirements and dependencies across our components. You also will need to include some JavaScript for our plugins.

{{< highlight scss >}}
// Custom.scss
// Option A: Include all of Bootstrap

@import "../node_modules/bootstrap/scss/bootstrap";
{{< /highlight >}}

{{< highlight scss >}}
// Custom.scss
// Option B: Include parts of Bootstrap

// Required
@import "../node_modules/bootstrap/scss/functions";
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/mixins";

// Optional
@import "../node_modules/bootstrap/scss/reboot";
@import "../node_modules/bootstrap/scss/type";
@import "../node_modules/bootstrap/scss/images";
@import "../node_modules/bootstrap/scss/code";
@import "../node_modules/bootstrap/scss/grid";
{{< /highlight >}}

With that setup in place, you can begin to modify any of the Sass variables and maps in your `custom.scss`. You can also start to add parts of Bootstrap under the `// Optional` section as needed. We suggest using the full import stack from our `bootstrap.scss` file as your starting point.

## Variable defaults

Every Sass variable in Bootstrap 4 includes the `!default` flag allowing you to override the variable's default value in your own Sass without modifying Bootstrap's source code. Copy and paste variables as needed, modify their values, and remove the `!default` flag. If a variable has already been assigned, then it won't be re-assigned by the default values in Bootstrap.

You will find the complete list of Bootstrap's variables in `scss/_variables.scss`. Some variables are set to `null`, these variables don't output the property unless they are overridden in your configuration.

Variable overrides within the same Sass file can come before or after the default variables. However, when overriding across Sass files, your overrides must come before you import Bootstrap's Sass files.

Here's an example that changes the `background-color` and `color` for the `<body>` when importing and compiling Bootstrap via npm:

{{< highlight scss >}}
// Your variable overrides
$body-bg: #000;
$body-color: #111;

// Bootstrap and its default variables
@import "../node_modules/bootstrap/scss/bootstrap";
{{< /highlight >}}

Repeat as necessary for any variable in Bootstrap, including the global options below.

## Maps and loops

Bootstrap 4 includes a handful of Sass maps, key value pairs that make it easier to generate families of related CSS. We use Sass maps for our colors, grid breakpoints, and more. Just like Sass variables, all Sass maps include the `!default` flag and can be overridden and extended.

Some of our Sass maps are merged into empty ones by default. This is done to allow easy expansion of a given Sass map, but comes at the cost of making _removing_ items from a map slightly more difficult.

### Modify map

All variables in the `$theme-colors` map are defined as standalone variables. To modify an existing color in our `$theme-colors` map, add the following to your custom Sass file:

{{< highlight scss >}}
$primary: #0074d9;
$danger: #ff4136;
{{< /highlight >}}

Later on, theses variables are set in Bootstrap's `$theme-colors` map:

{{< highlight scss >}}
$theme-colors: (
  "primary": $primary,
  "danger": $danger
);
{{< /highlight >}}

### Add to map

To add a new color to `$theme-colors`, add the new key and value:

{{< highlight scss >}}
$theme-colors: (
  "custom-color": #900
);
{{< /highlight >}}

### Remove from map

To remove colors from `$theme-colors`, or any other map, use `map-remove`. Be aware you must insert it between our requirements and options:

{{< highlight scss >}}
// Required
@import "../node_modules/bootstrap/scss/functions";
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/mixins";

$theme-colors: map-remove($theme-colors, "info", "light", "dark");

// Optional
@import "../node_modules/bootstrap/scss/root";
@import "../node_modules/bootstrap/scss/reboot";
@import "../node_modules/bootstrap/scss/type";
...
{{< /highlight >}}

## Required keys

Bootstrap assumes the presence of some specific keys within Sass maps as we used and extend these ourselves. As you customize the included maps, you may encounter errors where a specific Sass map's key is being used.

For example, we use the `primary`, `success`, and `danger` keys from `$theme-colors` for links, buttons, and form states. Replacing the values of these keys should present no issues, but removing them may cause Sass compilation issues. In these instances, you'll need to modify the Sass code that makes use of those values.

## Functions

### Colors

In Bootstrap 5, we've dropped the `color()`, `theme-color()` and `gray()` functions because the values are also available as standalone variables. So instead of using `theme-color("primary")`, you can now just use the `$primary` variable.

{{< highlight scss >}}
.custom-element {
  color: $gray-100;
  background-color: $dark;
}
{{< /highlight >}}

We also have a function for getting a particular _level_ of color. Negative level values will lighten the color, while higher levels will darken.

{{< scss-docs name="color-level" file="scss/_functions.scss" >}}

In practice, you'd call the function and pass in two parameters: the name of the color from `$theme-colors` (e.g., primary or danger) and a numeric level.

{{< highlight scss >}}
.custom-element {
  color: color-level($primary, -10);
}
{{< /highlight >}}

### Color contrast

In order to meet [WCAG 2.0 accessibility standards for color contrast](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html), authors **must** provide [a contrast ratio of at least 4.5:1](https://www.w3.org/WAI/WCAG20/quickref/20160105/Overview.php#visual-audio-contrast-contrast), with very few exceptions.

An additional function we include in Bootstrap is the color contrast function, `color-contrast`. It utilizes the [WCAG 2.0 algorithm](https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests) for calculating contrast thresholds based on [relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance) in a `sRGB` colorspace to automatically return a light (`#fff`) or dark (`#111`) contrast color based on the specified base color. This function is especially useful for mixins or loops where you're generating multiple classes.

For example, to generate color swatches from our `$theme-colors` map:

{{< highlight scss >}}
@each $color, $value in $theme-colors {
  .swatch-#{$color} {
    color: color-contrast($value);
  }
}
{{< /highlight >}}

It can also be used for one-off contrast needs:

{{< highlight scss >}}
.custom-element {
  color: color-contrast(#000); // returns `color: #fff`
}
{{< /highlight >}}

You can also specify a base color with our color map functions:

{{< highlight scss >}}
.custom-element {
  color: color-contrast($dark); // returns `color: #fff`
}
{{< /highlight >}}

### Escape SVG

We use the `escape-svg` function to escape the `<`, `>` and `#` characters for SVG background images.

### Add and Subtract functions

We use the `add` and `subtract` functions to wrap the CSS `calc` function. The primary purpose of these functions is to avoid errors when a "unitless" `0` value is passed into a `calc` expression. Expressions like `calc(10px - 0)` will return an error in all browsers, despite being mathematically correct.

Example where the calc is valid:

{{< highlight scss >}}
$border-radius: .25rem;
$border-width: 1px;

.element {
  // Output calc(.25rem - 1px) is valid
  border-radius: calc($border-radius - $border-width);
}

.element {
  // Output the same calc(.25rem - 1px) as above
  border-radius: subtract($border-radius, $border-width);
}
{{< /highlight >}}

Example where the calc is invalid:

{{< highlight scss >}}
$border-radius: .25rem;
$border-width: 0;

.element {
  // Output calc(.25rem - 0) is invalid
  border-radius: calc($border-radius - $border-width);
}

.element {
  // Output .25rem
  border-radius: subtract($border-radius, $border-width);
}
{{< /highlight >}}
