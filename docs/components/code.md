---
layout: page
title: Code
---

Styles for inline code snippets and longer, multiline blocks of code.

## Inline code

Wrap inline snippets of code with `code`. Be sure to escape HTML angle brackets.

{% example html %}
For example, <code>&lt;section&gt;</code> should be wrapped as inline.
{% endexample %}

## User input

Use the `<kbd>` to indicate input that is typically entered via keyboard.

{% example html %}
To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>
To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd>
{% endexample %}

## Preformatted text

Or, code blocks. Use `<pre>`s for multiple lines of code. Once again, be sure to escape any angle brackets in the code for proper rendering.

{% example html %}
<pre>&lt;p&gt;Sample text here...&lt;/p&gt;</pre>
{% endexample %}

You may optionally add the `.pre-scrollable` class, which will set a max-height of 350px and provide a y-axis scrollbar.

## Variables

For indicating variables use the `<var>` tag.

{% example html %}
<var>y</var> = <var>m</var><var>x</var> + <var>b</var>
{% endexample %}

## Sample output

For indicating blocks sample output from a program use the `<samp>` tag.

{% example html %}
<samp>This text is meant to be treated as sample output from a computer program.</samp>
{% endexample %}
