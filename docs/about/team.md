---
layout: docs
title: Team
group: about
---

Bootstrap is maintained by the founding team and a small group of invaluable core contributors, with the massive support and involvement of our community.

<div class="list-group bd-team">
  {% for member in site.data.core-team %}
    {% assign user = member.user %}
    <div class="list-group-item">
      <iframe class="github-btn" src="https://ghbtns.com/github-btn.html?user={{ user }}&amp;type=follow"></iframe>
      <a class="team-member" href="https://github.com/{{ user }}">
        {% avatar user=user size=32 %}
        <strong>{{ member.name }}</strong> <small>@{{ user }}</small>
      </a>
    </div>
  {% endfor %}
</div>

Get involved with Bootstrap development by [opening an issue](https://github.com/twbs/bootstrap/issues/new) or submitting a pull request. Read our [contributing guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md) for information on how we develop.
