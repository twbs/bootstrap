---
layout: docs
title: Translations
group: about
---

Community members have translated Bootstrap's documentation into various languages. None are officially supported and they may not always be up to date.

<ul>
{% for language in site.data.translations %}
  <li><a href="{{ language.url }}" hreflang="{{ language.code }}">{{ language.description }} ({{ language.name }})</a></li>
{% endfor %}
</ul>

**We don't help organize or host translations, we just link to them.**

Finished a new or better translation? Open a pull request to add it to our list.
