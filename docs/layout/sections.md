---
layout: docs
title: Sections
description: Documentation and examples for sections, our basic content blocks.
group: components
---

Used for styling different content section throughout the pages.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Default section

A simple example of a default `section` component.

{% capture example %}
<div class="section">
  <div class="section-inner">
    <div class="section-header">
      <h3>Example Section</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Section with header

A `section` with header `section-header` and a button `btn`.

{% capture example %}
<div class="section">
  <div class="section-inner">
    <div class="section-header">
      <h3 class="m-0">Example Section</h3>
      <a href="#" class="btn btn-primary ml-auto">Link</a>
    </div>
    <div class="section-body">
      <div class="card">
        <div class="card-block">
          <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
        </div>
      </div>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Successive sections

Successive `section` blocks, displaying their separation.

{% capture example %}
<div class="section">
  <div class="section-inner">
    <div class="section-header">
      <h3>Example Section 1</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
<div class="section section-contrast bg-faded">
  <div class="section-inner">
    <div class="section-header">
      <h3>Example Section 2</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

## Variants

Add any of the below mentioned modifier classes to change the appearance of a section.

{% capture example %}
<div class="section">
  <div class="section-inner">
    <div class="section-header">
      <h3>Default Section</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="section section-inverse bg-inverse">
  <div class="section-inner">
    <div class="section-header">
      <h3>Section Inverse</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="section section-contrast bg-faded">
  <div class="section-inner">
    <div class="section-header">
      <h3>Section Contrast</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="section section-primary bg-primary">
  <div class="section-inner">
    <div class="section-header">
      <h3>Section Primary</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="section bg-white">
  <div class="section-inner">
    <div class="section-header">
      <h3>Section Primary</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}

{% capture example %}
<div class="section section-inverse section-background holderjs" style="background-image: url(?holder.js/700x300?theme=vine);">
  <div class="section-inner">
    <div class="section-header">
      <h3>Section Background</h3>
    </div>
    <div class="section-body">
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
    </div>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
