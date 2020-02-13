---
layout: docs
title: Reboot
description: Reboot, a collection of element-specific CSS changes in a single file, kickstart Bootstrap to provide an elegant, consistent, and simple baseline to build upon.
group: content
aliases: "/docs/4.3/content/"
toc: true
---

## Approach

Reboot builds upon Normalize, providing many HTML elements with somewhat opinionated styles using only element selectors. Additional styling is done only with classes. For example, we reboot some `<table>` styles for a simpler baseline and later provide `.table`, `.table-bordered`, and more.

Here are our guidelines and reasons for choosing what to override in Reboot:

- Update some browser default values to use `rem`s instead of `em`s for scalable component spacing.
- Avoid `margin-top`. Vertical margins can collapse, yielding unexpected results. More importantly though, a single direction of `margin` is a simpler mental model.
- For easier scaling across device sizes, block elements should use `rem`s for `margin`s.
- Keep declarations of `font`-related properties to a minimum, using `inherit` whenever possible.

## Page defaults

The `<html>` and `<body>` elements are updated to provide better page-wide defaults. More specifically:

- The `box-sizing` is globally set on every element—including `*::before` and `*::after`, to `border-box`. This ensures that the declared width of element is never exceeded due to padding or border.
  - No base `font-size` is declared on the `<html>`, but `16px` is assumed (the browser default). `font-size: 1rem` is applied on the `<body>` for easy responsive type-scaling via media queries while respecting user preferences and ensuring a more accessible approach. This browser default can be overridden by modifying the `$font-size-root` variable.
- The `<body>` also sets a global `font-family`, `font-weight`, `line-height`, and `color`. This is inherited later by some form elements to prevent font inconsistencies.
- For safety, the `<body>` has a declared `background-color`, defaulting to `#fff`.

## Native font stack

The default web fonts (Helvetica Neue, Helvetica, and Arial) have been dropped in Bootstrap 4 and replaced with a "native font stack" for optimum text rendering on every device and OS. Read more about [native font stacks in this *Smashing Magazine* article](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/).

{{< highlight scss >}}
$font-family-sans-serif:
  // Safari for macOS and iOS (San Francisco)
  -apple-system,
  // Chrome < 56 for macOS (San Francisco)
  BlinkMacSystemFont,
  // Windows
  "Segoe UI",
  // Android
  Roboto,
  // Basic web fallback
  "Helvetica Neue", Arial,
  // Linux
  "Noto Sans",
  // Sans serif fallback
  sans-serif,
  // Emoji fonts
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;
{{< /highlight >}}

This `font-family` is applied to the `<body>` and automatically inherited globally throughout Bootstrap. To switch the global `font-family`, update `$font-family-base` and recompile Bootstrap.

## Headings and paragraphs

All heading elements—e.g., `<h1>`—and `<p>` are reset to have their `margin-top` removed. Headings have `margin-bottom: .5rem` added and paragraphs `margin-bottom: 1rem` for easy spacing.

<table class="table">
  <thead>
    <tr>
      <th>Heading</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        {{< markdown >}}`<h1></h1>`{{< /markdown >}}
      </td>
      <td><span class="h1">h1. Bootstrap heading</span></td>
    </tr>
    <tr>
      <td>
        {{< markdown >}}`<h2></h2>`{{< /markdown >}}
      </td>
      <td><span class="h2">h2. Bootstrap heading</span></td>
    </tr>
    <tr>
      <td>
        {{< markdown >}}`<h3></h3>`{{< /markdown >}}
      </td>
      <td><span class="h3">h3. Bootstrap heading</span></td>
    </tr>
    <tr>
      <td>
        {{< markdown >}}`<h4></h4>`{{< /markdown >}}
      </td>
      <td><span class="h4">h4. Bootstrap heading</span></td>
    </tr>
    <tr>
      <td>
        {{< markdown >}}`<h5></h5>`{{< /markdown >}}
      </td>
      <td><span class="h5">h5. Bootstrap heading</span></td>
    </tr>
    <tr>
      <td>
        {{< markdown >}}`<h6></h6>`{{< /markdown >}}
      </td>
      <td><span class="h6">h6. Bootstrap heading</span></td>
    </tr>
  </tbody>
</table>

## Lists

All lists—`<ul>`, `<ol>`, and `<dl>`—have their `margin-top` removed and a `margin-bottom: 1rem`. Nested lists have no `margin-bottom`. We've also reset the `padding-left` on `<ul>` and `<ol>` elements.

<div class="bd-example">
{{< markdown >}}
* Lorem ipsum dolor sit amet
* Consectetur adipiscing elit
* Integer molestie lorem at massa
* Facilisis in pretium nisl aliquet
* Nulla volutpat aliquam velit
  * Phasellus iaculis neque
  * Purus sodales ultricies
  * Vestibulum laoreet porttitor sem
  * Ac tristique libero volutpat at
* Faucibus porta lacus fringilla vel
* Aenean sit amet erat nunc
* Eget porttitor lorem

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
4. Facilisis in pretium nisl aliquet
5. Nulla volutpat aliquam velit
6. Faucibus porta lacus fringilla vel
7. Aenean sit amet erat nunc
8. Eget porttitor lorem
{{< /markdown >}}
</div>

For simpler styling, clear hierarchy, and better spacing, description lists have updated `margin`s. `<dd>`s reset `margin-left` to `0` and add `margin-bottom: .5rem`. `<dt>`s are **bolded**.

<div class="bd-example">
  <dl>
    <dt>Description lists</dt>
    <dd>A description list is perfect for defining terms.</dd>
    <dt>Euismod</dt>
    <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem.</dd>
    <dd>Donec id elit non mi porta gravida at eget metus.</dd>
    <dt>Malesuada porta</dt>
    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
  </dl>
</div>

## Inline code

Wrap inline snippets of code with `<code>`. Be sure to escape HTML angle brackets.

{{< example >}}
For example, <code>&lt;section&gt;</code> should be wrapped as inline.
{{< /example >}}

## Code blocks

Use `<pre>`s for multiple lines of code. Once again, be sure to escape any angle brackets in the code for proper rendering. The `<pre>` element is reset to remove its `margin-top` and use `rem` units for its `margin-bottom`.

{{< example >}}
<pre><code>&lt;p&gt;Sample text here...&lt;/p&gt;
&lt;p&gt;And another line of sample text here...&lt;/p&gt;
</code></pre>
{{< /example >}}

## Variables

For indicating variables use the `<var>` tag.

{{< example >}}
<var>y</var> = <var>m</var><var>x</var> + <var>b</var>
{{< /example >}}

## User input

Use the `<kbd>` to indicate input that is typically entered via keyboard.

{{< example >}}
To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>
To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd>
{{< /example >}}

## Sample output

For indicating sample output from a program use the `<samp>` tag.

{{< example >}}
<samp>This text is meant to be treated as sample output from a computer program.</samp>
{{< /example >}}

## Tables

Tables are slightly adjusted to style `<caption>`s, collapse borders, and ensure consistent `text-align` throughout. Additional changes for borders, padding, and more come with [the `.table` class]({{< docsref "/content/tables" >}}).

<div class="bd-example">
  <table>
    <caption>
      This is an example table, and this is its caption to describe the contents.
    </caption>
    <thead>
      <tr>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
        <th>Table heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
    </tbody>
  </table>
</div>

## Forms

Various form elements have been rebooted for simpler base styles. Here are some of the most notable changes:

- `<fieldset>`s have no borders, padding, or margin so they can be easily used as wrappers for individual inputs or groups of inputs.
- `<legend>`s, like fieldsets, have also been restyled to be displayed as a heading of sorts.
- `<label>`s are set to `display: inline-block` to allow `margin` to be applied.
- `<input>`s, `<select>`s, `<textarea>`s, and `<button>`s are mostly addressed by Normalize, but Reboot removes their `margin` and sets `line-height: inherit`, too.
- `<textarea>`s are modified to only be resizable vertically as horizontal resizing often "breaks" page layout.
- `<button>`s and `<input>` button elements have `cursor: pointer` when `:not(:disabled)`.

These changes, and more, are demonstrated below.

<form class="bd-example">
  <fieldset>
    <legend>Example legend</legend>
    <p>
      <label for="input">Example input</label>
      <input type="text" id="input" placeholder="Example input">
    </p>
    <p>
      <label for="email">Example email</label>
      <input type="email" id="email" placeholder="lorem@ipsum.com">
    </p>
    <p>
      <label for="tel">Example telephone</label>
      <input type="tel" id="tel">
    </p>
    <p>
      <label for="url">Example url</label>
      <input type="url" id="url">
    </p>
    <p>
      <label for="number">Example number</label>
      <input type="number" id="number">
    </p>
    <p>
      <label for="search">Example search</label>
      <input type="search" id="search">
    </p>
    <p>
      <label for="range">Example range</label>
      <input type="range" id="range" min="0" max="10">
    </p>
    <p>
      <label for="file">Example file input</label>
      <input type="file" id="file">
    </p>
    <p>
      <label for="select">Example select</label>
      <select id="select">
        <option value="">Choose...</option>
        <optgroup label="Option group 1">
          <option value="">Option 1</option>
          <option value="">Option 2</option>
          <option value="">Option 3</option>
        </optgroup>
        <optgroup label="Option group 2">
          <option value="">Option 4</option>
          <option value="">Option 5</option>
          <option value="">Option 6</option>
        </optgroup>
      </select>
    </p>
    <p>
      <label>
        <input type="checkbox" value="">
        Check this checkbox
      </label>
    </p>
    <p>
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
        Option one is this and that
      </label>
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
        Option two is something else that's also super long to demonstrate the wrapping of these fancy form controls.
      </label>
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
        Option three is disabled
      </label>
    </p>
    <p>
      <label for="textarea">Example textarea</label>
      <textarea id="textarea" rows="3"></textarea>
    </p>
    <p>
      <label for="date">Example date</label>
      <input type="date" id="date">
    </p>
    <p>
      <label for="time">Example time</label>
      <input type="time" id="time">
    </p>
    <p>
      <label for="password">Example password</label>
      <input type="password" id="password">
    </p>
    <p>
      <label for="datetime-local">Example datetime-local</label>
      <input type="datetime-local" id="datetime-local">
    </p>
    <p>
      <label for="week">Example week</label>
      <input type="week" id="week">
    </p>
    <p>
      <label for="month">Example month</label>
      <input type="month" id="month">
    </p>
    <p>
      <label for="color">Example color</label>
      <input type="color" id="color">
    </p>
    <p>
      <label for="output">Example output</label>
      <output name="result" id="output">100</output>
    </p>
    <p>
      <button type="submit">Button submit</button>
      <input type="submit" value="Input submit button">
      <input type="reset" value="Input reset button">
      <input type="button" value="Input button">
    </p>
    <p>
      <button type="submit" disabled>Button submit</button>
      <input type="submit" value="Input submit button" disabled>
      <input type="reset" value="Input reset button" disabled>
      <input type="button" value="Input button" disabled>
    </p>
  </fieldset>
</form>

{{< callout warning >}}
{{< partial "callout-warning-input-support.md" >}}
{{< /callout >}}

## Misc elements

### Address

The `<address>` element is updated to reset the browser default `font-style` from `italic` to `normal`. `line-height` is also now inherited, and `margin-bottom: 1rem` has been added. `<address>`s are for presenting contact information for the nearest ancestor (or an entire body of work). Preserve formatting by ending lines with `<br>`.

<div class="bd-example">
  <address>
    <strong>Twitter, Inc.</strong><br>
    1355 Market St, Suite 900<br>
    San Francisco, CA 94103<br>
    <abbr title="Phone">P:</abbr> (123) 456-7890
  </address>

  <address>
    <strong>Full Name</strong><br>
    <a href="mailto:first.last@example.com">first.last@example.com</a>
  </address>
</div>

### Blockquote

The default `margin` on blockquotes is `1em 40px`, so we reset that to `0 0 1rem` for something more consistent with other elements.

<div class="bd-example">
  <blockquote class="blockquote">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
  </blockquote>
</div>

### Inline elements

The `<abbr>` element receives basic styling to make it stand out amongst paragraph text.

<div class="bd-example">
  Nulla <abbr title="attribute">attr</abbr> vitae elit libero, a pharetra augue.
</div>

### Summary

The default `cursor` on summary is `text`, so we reset that to `pointer` to convey that the element can be interacted with by clicking on it.

<div class="bd-example">
  <details>
    <summary>Some details</summary>
    <p>More info about the details.</p>
  </details>

  <details open>
    <summary>Even more details</summary>
    <p>Here are even more details about the details.</p>
  </details>
</div>

## HTML5 `[hidden]` attribute

HTML5 adds [a new global attribute named `[hidden]`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden), which is styled as `display: none` by default. Borrowing an idea from [PureCSS](https://purecss.io/), we improve upon this default by making `[hidden] { display: none !important; }` to help prevent its `display` from getting accidentally overridden.

{{< highlight html >}}
<input type="text" hidden>
{{< /highlight >}}

{{< callout warning >}}
##### jQuery incompatibility

`[hidden]` is not compatible with jQuery's `$(...).hide()` and `$(...).show()` methods. Therefore, we don't currently especially endorse `[hidden]` over other techniques for managing the `display` of elements.
{{< /callout >}}

To merely toggle the visibility of an element, meaning its `display` is not modified and the element can still affect the flow of the document, use [the `.invisible` class]({{< docsref "/utilities/visibility" >}}) instead.
