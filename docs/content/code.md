---
layout: docs
title: Code
description: Documentation and examples for displaying inline and multiline blocks of code with Bootstrap.
group: content
---

Styles for inline code snippets and longer, multiline blocks of code.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Inline code

Wrap inline snippets of code with `<code>`. Be sure to escape HTML angle brackets.

{% example html %}
For example, <code>&lt;section&gt;</code> should be wrapped as inline.
{% endexample %}

## Code blocks

Use `<pre>`s for multiple lines of code. Once again, be sure to escape any angle brackets in the code for proper rendering. You may optionally add the `.pre-scrollable` class, which will set a max-height of 350px and provide a y-axis scrollbar.

{% example html %}
<pre><code>&lt;p&gt;Sample text here...&lt;/p&gt;
&lt;p&gt;And another line of sample text here...&lt;/p&gt;
</code></pre>
{% endexample %}

## Variables

For indicating variables use the `<var>` tag.

{% example html %}
<var>y</var> = <var>m</var><var>x</var> + <var>b</var>
{% endexample %}

## User input

Use the `<kbd>` to indicate input that is typically entered via keyboard.

{% example html %}
To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>
To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd>
{% endexample %}

## Sample output

For indicating sample output from a program use the `<samp>` tag.

{% example html %}
<samp>This text is meant to be treated as sample output from a computer program.</samp>
{% endexample %}
