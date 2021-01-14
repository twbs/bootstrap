---
layout: docs
title: Customize
description: Learn how to theme, customize, and extend Bootstrap with Sass, a boatload of global options, an expansive color system, and more.
group: customize
toc: false
aliases: "/docs/5.0/customize/"
sections:
  - title: Sass
    description: Utilize our source Sass files to take advantage of variables, maps, mixins, and functions.
  - title: Options
    description: Customize Bootstrap with built-in variables to easily toggle global CSS preferences.
  - title: Color
    description: Learn about and customize the color systems that support the entire toolkit.
  - title: Components
    description: Learn how we build nearly all our components responsively and with base and modifier classes.
  - title: CSS variables
    description: Use Bootstrap's CSS custom properties for fast and forward-looking design and development.
  - title: Optimize
    description: Keep your projects lean, responsive, and maintainable so you can deliver the best experience.
---

## Overview

There are multiple ways to customize Bootstrap. Your best path can depend on your project, the complexity of your build tools, the version of Bootstrap you're using, browser support, and more.

Our two preferred methods are:

1. Using Bootstrap [via package manager]({{< docsref "/getting-started/download#package-managers" >}}) so you can use and extend our source files.
2. Using Bootstrap's compiled distribution files or [jsDelivr]({{< docsref "/getting-started/download#cdn-via-jsdelivr" >}}) so you can add onto or override Bootstrap's styles.

While we cannot go into details here on how to use every package manager, we can give some guidance on [using Bootstrap with your own Sass compiler]({{< docsref "/customize/sass" >}}).

For those who want to use the distribution files, review the [getting started page]({{< docsref "/getting-started/introduction" >}}) for how to include those files and an example HTML page. From there, consult the docs for the layout, components, and behaviors you'd like to use.

As you familiarize yourself with Bootstrap, continue exploring this section for more details on how to utilize our global options, making use of and changing our color system, how we build our components, how to use our growing list of CSS custom properties, and how to optimize your code when building with Bootstrap.

## CSPs and embedded SVGs

Several Bootstrap components include embedded SVGs in our CSS to style components consistently and easily across browsers and devices. **For organizations with more strict <abbr title="Content Security Policy">CSP</abbr> configurations**, we've documented all instances of our embedded SVGs (all of which are applied via `background-image`) so you can more thoroughly review your options.

- [Accordion]({{< docsref "/components/accordion" >}})
- [Close button]({{< docsref "/components/close-button" >}}) (used in alerts and modals)
- [Form checkboxes and radio buttons]({{< docsref "/forms/checks-radios" >}})
- [Form switches]({{< docsref "/forms/checks-radios#switches" >}})
- [Form validation icons]({{< docsref "/forms/validation#server-side" >}})
- [Select menus]({{< docsref "/forms/select" >}})
- [Carousel controls]({{< docsref "/components/carousel#with-controls" >}})
- [Navbar toggle buttons]({{< docsref "/components/navbar#responsive-behaviors" >}})

Based on [community conversation](https://github.com/twbs/bootstrap/issues/25394), some options for addressing this in your own codebase include replacing the URLs with locally hosted assets, removing the images and using inline images (not possible in all components), and modifying your CSP. Our recommendation is to carefully review your own security policies and decide on a best path forward, if necessary.