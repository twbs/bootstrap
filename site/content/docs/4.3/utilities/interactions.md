---
layout: docs
title: Interactions
description: Utility classes that change how users interact with contents of a website.
group: utilities
toc: false
---

## Text selection

Change the way in which the content is selected when the user interacts with it.

{{< example >}}
<p class="user-select-all">This paragraph will be entirely selected when clicked by the user.</p>
<p class="user-select-auto">This paragraph has default select behavior.</p>
<p class="user-select-none">This paragraph will not be selectable when clicked by the user.</p>
{{< /example >}}

## Pointer events

Bootstrap provides `pe-none` and `pe-auto` classes to prevent or add element interactions.

{{< example >}}
<p><a href="#" class="pe-none">This link</a> can not be clicked.</p>
<p><a href="#" class="pe-auto">This link</a> can be clicked (this is default behaviour).</p>
<p class="pe-none"><a href="#">This link</a> can not be clicked because the <code>pointer-events</code> property is inherited from its parent. However, <a href="#" class="pe-auto">this link</a> has a <code>pe-auto</code> class and can be clicked.</p>
{{< /example >}}
