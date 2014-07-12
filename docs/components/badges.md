---
layout: page
title: Badges
---

Easily highlight new or unread items by adding a `<span class="badge"></span>` within links, Bootstrap navs, and more.

{% example html %}
<a href="#">Inbox <span class="badge">42</span></a>
{% endexample %}

### Self collapsing

When there are no new or unread items, badges will simply collapse (via CSS's `:empty` selector) provided no content exists within.

### Active nav

Built-in styles are included for placing badges in active states in pill navigations.

{% example html %}
<ul class="nav nav-pills" role="tablist">
  <li class="nav-item active" role="presentation">
    <a class="nav-link" href="#">Home <span class="badge">42</span></a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" href="#">Profile</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" href="#">Messages <span class="badge">3</span></a>
  </li>
</ul>
<ul class="nav nav-pills nav-stacked" role="tablist" style="max-width: 260px;">
  <li class="nav-item active" role="presentation">
    <a class="nav-link" href="#">
      <span class="badge pull-right">42</span>
      Home
    </a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" href="#">Profile</a>
  </li>
  <li class="nav-item" role="presentation">
    <a class="nav-link" href="#">
      <span class="badge pull-right">3</span>
      Messages
    </a>
  </li>
</ul>
{% endexample %}

### Buttons

Like active nav links, badges in Bootstrap buttons automatically restyle to better blend into the background.

{% example html %}
<button class="btn btn-primary btn-lg" type="button">
  Large button <span class="badge">4</span>
</button>
<button class="btn btn-primary" type="button">
  Button <span class="badge">4</span>
</button>
<button class="btn btn-primary btn-sm" type="button">
  Small button <span class="badge">4</span>
</button>
<button class="btn btn-primary btn-xs" type="button">
  Extra small <span class="badge">4</span>
</button>
{% endexample %}
