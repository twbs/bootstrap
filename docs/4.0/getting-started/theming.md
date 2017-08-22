---
layout: docs
title: Theming Bootstrap
description: Customize Bootstrap 4 with our new built-in Sass variables for global style preferences for easy theming and component changes.
group: getting-started
toc: true
---

## Introduction

In Bootstrap 3, theming was largely driven by variable overrides in LESS, custom CSS, and a separate theme stylesheet that we included in our `dist` files. With some effort, one could completely redesign the look of Bootstrap 3 without touching the core files. Bootstrap 4 provides a familiar, but slightly different approach.

Now, theming is accomplished by Sass variables, Sass maps, and custom CSS. There's no more dedicated theme stylesheet anymore; instead, you can enable the built-in theme to add gradients, shadows, and more.

## Sass

Utilize our source Sass files to take advantage of variables, maps, mixins, and more.

### File structure

Whenever possible, avoid modifying Bootstrap's core files. For Sass, that means creating your own stylesheet that imports Bootstrap so you can modify and extend it. Assuming you've downloaded our source files or are using package manager, you'll have a file structure that looks like this:

{% highlight plaintext %}
your-project/
├── scss
│   └── custom.scss
└── node_modules/
    └── bootstrap
        ├── js
        └── scss
{% endhighlight %}

In your `custom.scss`, you'll import Bootstrap's source Sass files. You have two options: include all of Bootstrap, or pick the parts you need. We encourage the latter, though be aware there are some requirements and dependencies across our components. You also will need to include some JavaScript for our plugins.

{% highlight scss %}
// Custom.scss
// Option A: Include all of Bootstrap

@import "node_modules/bootstrap/scss/bootstrap";
{% endhighlight %}

{% highlight scss %}
// Custom.scss
// Option B: Include parts of Bootstrap

// Required
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/variables";
@import "node_modules/bootstrap/scss/mixins";

// Optional
@import "node_modules/bootstrap/scss/reboot";
@import "node_modules/bootstrap/scss/type";
@import "node_modules/bootstrap/scss/images";
@import "node_modules/bootstrap/scss/code";
@import "node_modules/bootstrap/scss/grid";
{% endhighlight %}

With that setup in place, you can begin to modify any of the Sass variables and maps in your `custom.scss`. You can also start to add parts of Bootstrap under the `// Optional` section as needed.

### Variable defaults

Every Sass variable in Bootstrap 4 includes the `!default` flag, meaning you can override that default value in your own Sass even after that original variable's been defined. Copy and paste variables as needed, modify the values, remove the `!default` flag, and recompile.

For example, to change out the `color` and `background-color` for the `<body>`, you'd do the following:

{% highlight scss %}
$body-color: $gray-600;
$body-bg:    $gray-900;
{% endhighlight %}

Do the same for any variable in `scss/_variables.scss` you need to override.

### Maps and loops

Bootstrap 4 includes a handful of Sass maps, key value pairs that make it easier to generate families of related CSS. We use Sass maps for our colors, grid breakpoints, and more. Just like Sass variables, all Sass maps include the `!default` flag and can be overridden and extended.

For example, to modify an existing color in our `$theme-colors` map, add the following to your custom Sass file:

{% highlight scss %}
$theme-colors: (
  primary: $red,
  danger: $orange
);
{% endhighlight %}

**TODO:**
- Adding an option
- Removing an option (replacing the map wholesale)

### Functions

**TODO:**
- Are these even considered part of the theme-ability of Bootstrap? Should this fall elsewhere?


## Sass options

**TODO:**
- pull in the `options.md` section here
- create a redirect from there

## Colors

**TODO:**
- pull in the `options.md` section here
- add a theme-colors customization option
- fallback variables
- mentino component modifiers get changed

## Components

**TODO:**
- how to change component mixins?
