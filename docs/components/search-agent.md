---
layout: docs
title: Search Agent
description: Documentation for the correct implementation of the Search Agent.
group: components
---

Small and adaptive tag for adding context to just about any content.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Example

Default Search Agent in horizontal alignment

{% example html %}
<div class="card">
  <div class="card-block search-agent">
    <div class="row">
      <div class="col-12 col-sm-6 push-sm-6">
        <div class="search-agent-body">
          <p class="search-agent-byline">Suchagent</p>
          <p class="search-agent-title">Direkt in Deinen Posteingang</p>
          <p class="search-agent-text">Sobald ein neuer Job eingestellt wird, schicken wir Dir eine Mail.</p>
          <button type="button" class="btn btn-primary">Benachrichtigung anlegen</button>
        </div>
      </div>
      <div class="col-12 col-sm-6 pull-sm-6">
        <div class="search-agent-visual">
          <img class="search-agent-image" data-src="holder.js/360x412?auto=yes&bg=777&fg=555&text=Image" alt="Image">
        </div>
      </div>
    </div>
  </div>
</div>
{% endexample %}

## Vertical Variant

For a vertical Variant, simply remove the `push` and `pull` class and leave columns at `col-12`.

{% example html %}
<div class="card" style="width: 24rem">
  <div class="card-block search-agent">
    <div class="row">
      <div class="col-12">
        <div class="search-agent-body">
          <p class="search-agent-byline">Suchagent</p>
          <p class="search-agent-title">Direkt in Deinen Posteingang</p>
          <p class="search-agent-text">Sobald ein neuer Job eingestellt wird, schicken wir Dir eine Mail.</p>
          <button type="button" class="btn btn-primary">Benachrichtigung anlegen</button>
        </div>
      </div>
      <div class="col-12">
        <div class="search-agent-visual">
          <img class="search-agent-image" data-src="holder.js/360x412?auto=yes&bg=777&fg=555&text=Image" alt="Image">
        </div>
      </div>
    </div>
  </div>
</div>
{% endexample %}
