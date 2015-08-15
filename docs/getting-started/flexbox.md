---
layout: docs
title: Flexbox
group: getting-started
---

Flexbox support has finally come to Bootstrap. Opt-in to the new CSS layout styles with the flick of a variable or the swap of a stylesheet.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## What's included

Flexbox support is available for a number of Bootstrap's components:

- The entire grid system (mixins and predefined classes), which switch from `float`s to `display: flex;`.
- Input groups, which move from `display: table;` to `display: flex;`.
- The media component moves from `display: table;` and a number of hacky styles to a simple `display: flex;`.

Vendor prefixes are provided in our compiled CSS with Autoprefixer via Grunt.

## Why flexbox?

In a nutshell, flexbix provides simpler and more flexible layout options in CSS. More specifically, it provides:

- Easy vertical alignment of content within a parent element.
- Easy reordering of content across devices and screen resolutions with the help of media queries.
- Easy CSS-only equal height columns for your grid-based layouts.

All these things are possible outside flexbox, but typically require extra hacks and workarounds to do right.

## How it works

If you're familiar with modifying variables in Sass—or any other CSS preprocessor—you'll be right at home to move into flexbox mode.

1. Open the `_variables.scss` file and find the `$enable-flex` variable.
2. Change it from `false` to `true`.
3. Recompile, and done!

Alternatively, if you don't need the source Sass files, you may swap the default Bootstrap compiled CSS with the compiled flexbox variation. [Head to the download page](/getting-started/download) for more information.

## Browser support

Enabling flexbox means **reduced browser and device support:**

- Internet Explorer 9 and below do not support flexbox.
- Internet Explorer 10 has a few known quirks.

Please be extra conscious of your user base when enabling flexbox in your project.
