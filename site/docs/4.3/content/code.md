---
layout: docs
title: Code
description: Documentation and examples for displaying inline and multiline blocks of code with Bootstrap.
group: content
toc: true
---

## Inline code

Wrap inline snippets of code with `<code>`. Be sure to escape HTML angle brackets.

{% capture example %}
For example, <code>&lt;section&gt;</code> should be wrapped as inline.
{% endcapture %}
{% include example.html content=example %}

## Code blocks

Use `<pre>`s for multiple lines of code. Once again, be sure to escape any angle brackets in the code for proper rendering. You may optionally add the `.pre-scrollable` class, which will set a max-height of 340px and provide a y-axis scrollbar.

{% capture example %}
<pre><code>&lt;p&gt;Sample text here...&lt;/p&gt;
&lt;p&gt;And another line of sample text here...&lt;/p&gt;
</code></pre>
{% endcapture %}
{% include example.html content=example %}

## Variables

For indicating variables use the `<var>` tag.

{% capture example %}
<var>y</var> = <var>m</var><var>x</var> + <var>b</var>
{% endcapture %}
{% include example.html content=example %}

## User input

Use the `<kbd>` to indicate input that is typically entered via keyboard.

{% capture example %}
To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>
To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd>
{% endcapture %}
{% include example.html content=example %}

## Sample output

For indicating sample output from a program use the `<samp>` tag.

{% capture example %}
<samp>This text is meant to be treated as sample output from a computer program.</samp>
{% endcapture %}
{% include example.html content=example %}

## Variables

| Variable | Default | Description | 
| --- | --- | -- |
| $code-font-size | 87.5% | The font size in relation to the text. This gets run through some RFS wizardry. |
| $code-color | $pink (`#e83e8c !default;`)| The color of the text in the `<code>` elements.|
| $kbd-padding-y | .2rem | Determines the padding along the x-axis |
| $kbd-padding-x | .4rem | Determines the padding along the y-axis |
| $kbd-font-size | $code-font-size | Determines the font size for the KBD element. |
| $kbd-color | $white (`#fff !default`) | Determines the font color of the `<kbd>` element. |
| $kbd-bg | $gray-900 | Determines the background color of the `<kbd>`. Note that by default `$gray-900` is set to `#212529` |
| $pre-color | $gray-900 | Determines the font color of the `<pre>` element. Note that by default `$gray-900` is set to `#212529` |
| $pre-scrollable-max-height | 340px | The max height for `.pre-scrollable` elements before the scrollbar appears. |
