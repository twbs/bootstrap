---
layout: docs
title: Interactions
description: Utility classes that change how users interact with the contents of a website.
group: utilities
---

## Text selection

Change how the content is selected when the user interacts with it.

{% capture example %}
<p class="user-select-all">This paragraph will be entirely selected when clicked by the user.</p>
<p class="user-select-auto">This paragraph has the default select behavior.</p>
<p class="user-select-none">This paragraph will not be selectable when clicked by the user.</p>
{% endcapture %}
{% include example.html content=example %}

Customize the available classes by changing the `$user-selects` Sass list in `_variables.scss`.
