---
layout: docs
title: Flexbox
group: utilities
---

Quickly manage the layout, alignment, and sizing of grid columns, navigation, components, and more with a full suite of responsive flexbox utilities. For more complex implementations, custom CSS may be necessary.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Enable flex behaviors

Apply `display` utilities to create a flexbox container and transform **direct children elements** into flex items. Flex containers and items are able to be modified further with additional flex properties. Choose from the following options.

| Class | property: value; | Description |
| --- | --- | --- |
| `.d-flex` | `display: flex;` | Creates a block-level element using the flexbox model. |
| `.d-inline-flex` | `display: inline-flex;` | Creates an inline-level element using the flexbox model. |

{% example html %}
<div class="d-flex p-2 bd-highlight">I'm a flexbox container!</div>
{% endexample %}

{% example html %}
<div class="d-inline-flex p-2 bd-highlight">I'm an inline flexbox container!</div>
{% endexample %}

Responsive variations also exist for `.d-flex` and `.d-inline-flex`.

<table class="table-responsive">
  <thead>
    <tr class="bg-faded">
      <th>Class</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {% for bp in site.data.breakpoints %}
    <tr>
      <td>
        <code>.d{{ bp.abbr }}-flex</code>
      </td>
      <td>
        Sets <code>display: flex;</code> on viewports {{ bp.min-width }} wide and up
      </td>
    </tr>
    {% endfor %}
    {% for bp in site.data.breakpoints %}
    <tr>
      <td>
        <code>.d{{ bp.abbr }}-inline-flex</code>
      </td>
      <td>
        Sets <code>display: inline-flex;</code> on viewports {{ bp.min-width }} wide and up
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>

## Direction

Set the direction of flex items in a flex container with direction utilities. In most cases you can omit the horizontal class here as the browser default is `row`. However, you may encounter situations where you needed to explicitly set this value (like responsive layouts).

Use `.flex-row` to set a horizontal direction.

{% example html %}
<div class="d-flex flex-row bd-highlight">
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
</div>
{% endexample %}

Use `.flex-column` to set a vertical direction.

{% example html %}
<div class="d-flex flex-column bd-highlight">
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
</div>
{% endexample %}

Responsive variations also exist for `.flex-row` and `.flex-column`.

<table class="table-responsive">
  <thead>
    <tr class="bg-faded">
      <th>Class</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {% for bp in site.data.breakpoints %}
    <tr>
      <td>
        <code>.flex{{ bp.abbr }}-row</code>
      </td>
      <td>
        Sets <code>flex-direction: row;</code> on viewports {{ bp.min-width }} wide and up
      </td>
    </tr>
    {% endfor %}
    {% for bp in site.data.breakpoints %}
    <tr>
      <td>
        <code>.flex{{ bp.abbr }}-column</code>
      </td>
      <td>
        Sets <code>flex-direction: column;</code> on viewports {{ bp.min-width }} wide and up
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>

## Wrap

Change how flex items wrap in a flex container. Choose from no wrapping at all (the browser default) with `.flex-nowrap`, or enable wrapping with `.flex-wrap`.

{% example html %}
<div class="d-flex flex-nowrap bd-highlight">
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
<div class="p-2 bd-highlight">Flex item</div>
</div>
{% endexample %}

{% example html %}
<div class="d-flex flex-wrap bd-highlight">
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
  <div class="p-2 bd-highlight">Flex item</div>
</div>
{% endexample %}

Responsive variations also exist for `.flex-nowrap` and `.flex-wrap`.

<table class="table-responsive">
  <thead>
    <tr class="bg-faded">
      <th>Class</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {% for bp in site.data.breakpoints %}
    <tr>
      <td>
        <code>.flex{{ bp.abbr }}-nowrap</code>
      </td>
      <td>
        Sets <code>flex-wrap: nowrap;</code> on viewports {{ bp.min-width }} wide and up
      </td>
    </tr>
    {% endfor %}
    {% for bp in site.data.breakpoints %}
    <tr>
      <td>
        <code>.flex{{ bp.abbr }}-wrap</code>
      </td>
      <td>
        Sets <code>flex-wrap: wrap;</code> on viewports {{ bp.min-width }} wide and up
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>
