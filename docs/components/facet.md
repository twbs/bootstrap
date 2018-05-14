---
layout: docs
title: Facet
description: Facet Component is an extension to cards.
group: components
---

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Facet
Shows implementations of the facet element.

{% example html %}
<section class="facet">
  <div class="facet-header">
    <button type="button" class="btn btn-link facet-toggle" data-toggle="collapse" href="#facetDefaultExample" aria-expanded="false" aria-controls="collapseExample">
      <strong class="facet-title">Facet Heading</strong>
    </button>
  </div>
  <div class="facet-body collapse" id="facetDefaultExample">
    <ul class="facet-group">
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Cras justo odio</a>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Dapibus ac facilisis in</a>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Vestibulum at eros</a>
      </li>
    </ul>
  </div>
</section>
{% endexample %}

### Show more
Shows implementations of the facet element with doubled collapse.

{% example html %}
<section class="facet">
  <div class="facet-header">
    <button type="button" class="btn btn-link facet-toggle" data-toggle="collapse" href="#facetSubCollapseExample" aria-expanded="true" aria-controls="collapseExample">
      <strong class="facet-title">Facet Heading</strong>
    </button>
  </div>
  <div class="facet-body collapse show" id="facetSubCollapseExample">
    <ul class="facet-group">
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Cras justo odio</a>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Dapibus ac facilisis in</a>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Vestibulum at eros</a>
      </li>
    </ul>
    <div class="collapse" id="facetSubCollapseItem">
      <ul class="facet-group">
        <li class="facet-group-item">
          <a href="#" class="facet-group-link">Cras justo odio</a>
        </li>
        <li class="facet-group-item">
          <a href="#" class="facet-group-link">Dapibus ac facilisis in</a>
        </li>
        <li class="facet-group-item">
          <a href="#" class="facet-group-link">Vestibulum at eros</a>
        </li>
      </ul>
    </div>
    <button type="button" class="btn btn-link facet-toggle facet-toggle-more" data-toggle="collapse" href="#facetSubCollapseItem" aria-expanded="false" aria-controls="collapseExample">Show more</button>
  </div>
</section>
{% endexample %}

### Nested Lists
Shows implementations of the facet element with doubled collapse.

{% example html %}
<section class="facet">
  <div class="facet-header">
    <button type="button" class="btn btn-link facet-toggle" data-toggle="collapse" href="#facetNestedLists" aria-expanded="true" aria-controls="collapseExample">
      <strong class="facet-title">Facet Heading</strong>
    </button>
  </div>
  <div class="facet-body collapse show" id="facetNestedLists">
    <ul class="facet-group">
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Cras justo odio</a>
      </li>
      <li class="facet-group-item">
        <ul class="facet-group">
          <li class="facet-group-item">
            <a href="#" class="facet-group-link">Sub</a>
          </li>
          <li class="facet-group-item">
            <a href="#" class="facet-group-link">Sub</a>
          </li>
          <li class="facet-group-item">
            <a href="#" class="facet-group-link">Sub</a>
          </li>
        </ul>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Cras justo odio</a>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Cras justo odio</a>
      </li>
      <li class="facet-group-item">
        <a href="#" class="facet-group-link">Cras justo odio</a>
      </li>
    </ul>
    <button type="button" class="btn btn-link facet-toggle facet-toggle-more"><span class="icon-arrow-left"></span> Alle Berufskategorien</button>
  </div>
</section>
{% endexample %}

### Checkboxes
Shows implementations of the facet element with doubled collapse.

{% example html %}
<section class="facet">
  <div class="facet-header">
    <button type="button" class="btn btn-link facet-toggle" data-toggle="collapse" href="#facetCheckboxes" aria-expanded="true" aria-controls="collapseExample">
      <strong class="facet-title">Facet Heading</strong>
    </button>
  </div>
  <div class="facet-body collapse show" id="facetCheckboxes">
    <ul class="facet-group">
      <li class="facet-group-item">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" value="">
          Option one
        </label>
      </li>
      <li class="facet-group-item">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" value="">
          Option two
        </label>
      </li>
      <li class="facet-group-item">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" value="">
          Option three
        </label>
      </li>
      <li class="facet-group-item">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" value="">
          Option four
        </label>
      </li>
    </ul>
    <div class="collapse" id="facetChecksCollapseItem">
      <ul class="facet-group">
        <li class="facet-group-item">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" value="">
            Option five
          </label>
        </li>
        <li class="facet-group-item">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" value="">
            Option six
          </label>
        </li>
        <li class="facet-group-item">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" value="">
            Option seven
          </label>
        </li>
        <li class="facet-group-item">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" value="">
            Option eight
          </label>
        </li>
      </ul>
    </div>
    <button type="button" class="btn btn-link facet-toggle facet-toggle-more" data-toggle="collapse" href="#facetChecksCollapseItem" aria-expanded="false" aria-controls="collapseExample">Show all</button>
  </div>
</section>
{% endexample %}

### Selected Facet
Shows implementations of the selected facet element

{% example html %}
<section class="facet facet-highlighted">
  <div class="facet-header">
    <p class="facet-title"><strong>Deine Auswahl</strong></p>
    <button type="button" class="btn btn-link btn-sm btn-right">Alle löschen <span class="icon-remove"></span></button>
  </div>
  <div class="facet-body">
    <ul class="facet-group">
      <li class="facet-group-item">
        <div class="facet-selected">
          <button type="button" class="btn btn-primary btn-facet">
            Lorem Ipsum
          </button>
        </div>
      </li>
      <li class="facet-group-item">
        <div class="facet-selected">
          <button type="button" class="btn btn-primary btn-facet">
            Very Ipsum
          </button>
        </div>
      </li>
      <li class="facet-group-item">
        <div class="facet-selected">
          <button type="button" class="btn btn-primary btn-facet">
            Ipsum Noomum ac facilisis in justo odio at veris calendaris
          </button>
        </div>
      </li>
      <li class="facet-group-item">
        <div class="facet-selected">
          <button type="button" class="btn btn-primary btn-facet">
            Gipsum
          </button>
        </div>
      </li>
    </ul>
  </div>
</section>
{% endexample %}