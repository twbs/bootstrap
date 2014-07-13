---
layout: page
title: Team
---

Bootstrap is maintained by the founding team and a small group of invaluable core contributors, with the massive support and involvement of our community.

## Core team

<div class="list-group bs-team">
  {% for member in site.data.core-team %}
    <div class="list-group-item">
      <iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user={{ member.user }}&amp;type=follow"></iframe>
      <a class="team-member" href="https://github.com/{{ member.user }}">
        <img src="http://www.gravatar.com/avatar/{{ member.gravatar }}" alt="@{{ member.user }}">
        <strong>{{ member.name }}</strong> <small>@{{ member.user }}</small>
      </a>
    </div>
  {% endfor %}
</div>

Get involved with Bootstrap development by [opening an issue](https://github.com/twbs/bootstrap/issues/new) or submitting a pull request. Read our [contributing guidelines](https://github.com/twbs/bootstrap/blob/master/CONTRIBUTING.md) for information on how we develop.

## Sass team

<div class="list-group bs-team">
  {% for member in site.data.sass-team %}
    <div class="list-group-item">
      <iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user={{ member.user }}&amp;type=follow"></iframe>
      <a class="team-member" href="https://github.com/{{ member.user }}">
        <img src="http://www.gravatar.com/avatar/{{ member.gravatar }}" alt="@{{ member.user }}">
        <strong>{{ member.name }}</strong> <small>@{{ member.user }}</small>
      </a>
    </div>
  {% endfor %}
</div>

The [official Sass port of Bootstrap]({{ site.sass_repo }}) was created and is maintained by this team. It became part of Bootstrap's organization with v3.1.0. Read the Sass [contributing guidelines](https://github.com/twbs/bootstrap-sass/blob/master/CONTRIBUTING.md) for information on how the Sass port is developed.
