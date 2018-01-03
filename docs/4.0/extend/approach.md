---
layout: docs
title: Approach
description: Learn about the guiding principles, strategies, and techniques used to build and maintain Bootstrap so you can more easily customize and extend it yourself.
group: extend
---

While the getting started pages provide an introductory tour of the project and what it offers, this document focuses on _why_ we do the things we do in Bootstrap. It's meant to clearly explain our philosophy to building on the web so that others can not only learn and contribute alongside us, but help us improve our own approach.

See something that doesn't sound right, or perhaps could be done better? [Open an issue](https://github.com/twbs/bootstrap/issues/new)—we'd love to discuss it with you.

## Summary

We'll dive into each of these more throughout, but at a high level, here's what guides our approach.

- Class should be responsive-up (aka, mobile-first)
- Components should be built with a base class and extended via modifier classes
- Component states should obey a common z-index scale: default (initial), hover (1), active (2), focus (3)
- Whenever possible, prefer a HTML+CSS implementation over JavaScript
- Whenever possible, use utilities over custom styles
- Whenever possible, avoid enforcing strict HTML requirements (children selectors)

## Responsive-up
- sometimes called mobile-first, but that can be a misnomer
- styles apply to a min-width and up

## Base and modifier classes
- Components should be built with a base class that houses common, not-to-be overridden property-value pairs.
- For example, `.btn` and `.btn-primary`. We use `.btn` for all the common styles like `display`, `padding`, and `border-width`. We then use modifiers like `.btn-primary` to add the color, background-color, border-color, etc.

## z-index scales
There are two `z-index` scales in Bootstrap—elements within a component and overlay components.

### Component elements
- Some components in Bootstrap are built with overlapping elements to prevent double borders without modifying the `border` property. For example, button groups, input groups, and pagination.
- These components share a standard `z-index` scale of `0` through `3`.
- `0` is default (initial), `1` is `:hover`, `2` is `:active`/`.active`, and , `3` is `:focus`.
- This approach matches our expectations of highest user priority. If an element is focused, it's in view and at the user's attention. Active elements are second highest because they indicate state. Hover is third highest because it indicates user intent, but nearly _anything_ can be hovered.

### Overlay components
Bootstrap includes several components that function as an overlay of some kind. This includes, in order of highest `z-index`, dropdowns, fixed and sticky navbars, modals, tooltips, and popovers. These components have their own `z-index` scale that begins at `1000`. This starting number is random and serves as a small buffer between our styles and your project's custom styles.

Each overlay component increases it's `z-index` value slightly in such a way that common UI principles allow user focused or hovered elements to remain in view at all times. For example, a modal is document blocking (e.g., you cannot take any other action save for the modal's action), so we put that above our navbars.

Learn more about this in our [`z-index` layout page](/docs/4.0/layout/overview/#z-index).

## HTML and CSS over JS
Whenever possible, we prefer to write HTML and CSS over JavaScript. In general, HTML and CSS are more prolific and accessible to more people of all different experience levels. HTML and CSS are also faster in your browser than JavaScript, and your browser general provides a great deal of functionality for you.

This principle is our first-class JavaScript API is `data` attributes. You don’t need to write nearly any JavaScript to use our JavaScript plugins; instead, write HTML. Read more about this in [our JavaScript overview page]().

Lastly, our styles build on the fundamental behaviors of common web elements. Whenever possible, we prefer to use what the browser provides. For example, you can put a `.btn` class on nearly any element, but most elements don’t provide any semantic value or browser functionality. So instead, we use `<button>`s and `<a>`s.

The same goes for more complex components. While we *could* write our own form validation plugin to add classes to a parent element based on an input’s state, thereby allowing us to style the text say red, we prefer using the `:valid`/`:invalid` pseudo-elements every browser provides us.

## Utilities

Utility classes—formerly helpers in Bootstrap 3—are a powerful ally in combatting CSS bloat and poor page performance. A utility class is typically a single, immutable property-value pairing expressed as a class (e.g., `.d-block` represents `display: block;`). Their primary appeal is speed of use while writing HTML and limiting the amount of custom CSS you have to write.

Specifically regarding custom CSS, utilities can help combat increasing file size by reducing your most commonly repeated property-value pairs into single classes. This can have a dramatic effect at scale in your projects.

## Flexible HTML

While not always possible, we strive to avoid being overly dogmatic in our HTML requirements for components. Thus, we focus on single classes in our CSS selectors and try to avoid immediate children selectors (`~`). This gives you more flexibility in your implementation and helps keep our CSS simpler and less specific.
