---
layout: docs
title: Spacing
description: Bootstrap includes a wide range of shorthand responsive margin and padding utility classes to modify an element's appearance.
group: utilities
toc: true
---

## How it works

Assign responsive-friendly `margin` or `padding` values to an element or a subset of its sides with shorthand classes. Includes support for individual properties, all properties, and vertical and horizontal properties. Classes are built from a default Sass map ranging from `.25rem` to `3rem`.

## Notation

Spacing utilities that apply to all breakpoints, from `xs` to `xl`, have no breakpoint abbreviation in them. This is because those classes are applied from `min-width: 0` and up, and thus are not bound by a media query. The remaining breakpoints, however, do include a breakpoint abbreviation.

The classes are named using the format `{property}{sides}-{size}` for `xs` and `{property}{sides}-{breakpoint}-{size}` for `sm`, `md`, `lg`, and `xl`.

Where *property* is one of:

* `m` - for classes that set `margin`
* `p` - for classes that set `padding`

Where *sides* is one of:

* `t` - for classes that set `margin-top` or `padding-top`
* `b` - for classes that set `margin-bottom` or `padding-bottom`
* `l` - for classes that set `margin-left` or `padding-left`
* `r` - for classes that set `margin-right` or `padding-right`
* `x` - for classes that set both `*-left` and `*-right`
* `y` - for classes that set both `*-top` and `*-bottom`
* blank - for classes that set a `margin` or `padding` on all 4 sides of the element

Where *size* is one of:

* `0` - for classes that eliminate the `margin` or `padding` by setting it to `0`
* `1` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * .25` or `$spacer-y * .25`
* `2` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * .5` or `$spacer-y * .5`
* `3` - (by default) for classes that set the `margin` or `padding` to `$spacer-x` or `$spacer-y`
* `4` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * 1.5` or `$spacer-y * 1.5`
* `5` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * 2` or `$spacer-y * 2`
* `6` - (by default) for classes that set the `margin` or `padding` to `$spacer-x * 4` or `$spacer-y * 4`

(You can add more sizes by adding entries to the `$spacers` Sass map variable.)

## Examples

Here are some representative examples of these classes:

{% highlight scss %}
.mt-0 {
  margin-top: 0 !important;
}

.ml-1 {
  margin-left: ($spacer * .25) !important;
}

.px-2 {
  padding-left: ($spacer * .5) !important;
  padding-right: ($spacer * .5) !important;
}

.p-3 {
  padding: $spacer !important;
}
{% endhighlight %}

### Horizontal centering

Additionally, Bootstrap also includes an `.mx-auto` class for horizontally centering fixed-width block level content—that is, content that has `display: block` and a `width` set—by setting the horizontal margins to `auto`.

<div class="bd-example">
  <div class="mx-auto" style="width: 200px; background-color: rgba(86,61,124,.15);">
    Centered element
  </div>
</div>

{% highlight html %}
<div class="mx-auto" style="width: 200px;">
  Centered element
</div>
{% endhighlight %}

### Card Spacing in use

Here are the use cases of the p spacer in use with cards. For mobile breakpoints, as Bootstrap is created mobile first, please begin to define xs - up.

#### Card p-0
As used for example on Job Detail. In this case we don't really need the `p-` tag, as card-img is fullwidth by default, but for the sake of demonstration, here it is.

<div class="card" style="width: 320px;">
  <div class="card-block">
    <div class="row">
      <div class="col-5">
        <img class="img-fluid" data-src="holder.js/160x160?auto=yes" alt="Generic placeholder image">
      </div>
      <div class="col-7">
        <p class="m-0">Arbeitgeber</p>
        <h2 class="mt-0">Delos Destinations + Co. KG</h2>
        <a href="#" class="btn btn-primary btn-cta">Zum Unternehmen</a>
      </div>
    </div>
  </div>
  <div class="card-img p-0">
    <img data-src="holder.js/320x480?auto=yes" alt="card-img">
  </div>
  <table class="table table-flush table-responsive">
    <tbody>
      <tr>
        <th>Company</th>
        <td>Delos Destinations</td>
      </tr>
      <tr>
        <th>Employees</th>
        <td>5000</td>
      </tr>
      <tr>
        <th>Website</th>
        <td><a href="https://muenchenerjobs.de/">http://muenchenerjobs.de</a></td>
      </tr>
    </tbody>
  </table>
</div>

{% highlight html %}
<div class="card" style="width: 320px;">
  <div class="card-block">
    ...
  </div>
  <div class="card-img p-0">
    <img data-src="holder.js/320x480?auto=yes" alt="card-img">
  </div>
  <table class="table table-flush table-responsive">
    ...
  </table>
</div>
{% endhighlight %}

#### Card p-4
As used in company detail, here is an example with a padded logo. Most logos are on white, but as we cannot rely on our clients to upload a logo with enough whitespace on the edges, here is the padded version.

<div class="row">
  <div class="col-12 col-sm-6">
    <div class="card" style="width: 320px;">
      <div class="card-img p-4">
        <img class="img-fluid" data-src="holder.js/320x160?auto=yes?text=Delos Destinations Logo" alt="img-fluid">
      </div>
      <table class="table table-flush table-responsive">
        <tbody>
          <tr>
            <th>Company</th>
            <td>Delos Destinations</td>
          </tr>
          <tr>
            <th>Employees</th>
            <td>5000</td>
          </tr>
          <tr>
            <th>Website</th>
            <td><a href="https://muenchenerjobs.de/">http://muenchenerjobs.de</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-12 col-sm-6">
    <div class="card" style="width: 320px;">
      <div class="card-img p-4">
        <img class="img-fluid" data-src="holder.js/160x320?auto=yes?text=Delos Destinations Logo" alt="img-fluid">
      </div>
      <table class="table table-flush table-responsive">
        <tbody>
          <tr>
            <th>Company</th>
            <td>Delos Destinations</td>
          </tr>
          <tr>
            <th>Employees</th>
            <td>5000</td>
          </tr>
          <tr>
            <th>Website</th>
            <td><a href="https://muenchenerjobs.de/">http://muenchenerjobs.de</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

{% highlight html %}
<div class="card" style="width: 320px;">
  <div class="card-img p-4">
    <img data-src="holder.js/320x480?auto=yes" alt="card-img">
  </div>
  <table class="table table-flush table-responsive">
    ...
  </table>
</div>
{% endhighlight %}


#### Card p-6
As used in Job Detail for Content. Note, that we use responsive utilities and different padding for x and y.

{% capture example %}
<div class="card">
  <div class="card-block px-3 py-3 px-sm-4 py-sm-3 px-md-5 py-md-4 px-lg-6 py-lg-5">
    <h1 class="card-title">Ausbildung zum Drogist (w/m) mit der Möglichkeit der Zusatzqualifikation zum Handelsfachwirt 2017 <small>in München</small></h1>
    <p class="card-text small"><span class="badge badge-primary">Top Job</span> <a href="#">dm-drogerie markt GmbH + Co. KG</a></p>
  </div>
  <div class="card-img">
    <img class="img-fluid" data-src="holder.js/100px180" alt="Card image cap">
  </div>
  <div class="card-block px-3 py-3 px-sm-4 py-sm-3 px-md-5 py-md-4 px-lg-6 py-lg-5">
    <h2 class="card-title">Stellenbeschreibung</h2>
    <p>AmRest Holdings SE is the largest independent restaurant operator in Central and Eastern Europe with a growing international presence. Since 1993 we have been building a portfolio of well recognized, power brands such as KFC, Pizza Hut, Burger King and Starbucks based on solid franchise and joint venture partnerships. AmRest owns the La Tagliatella brand which is being developed internationally as both Company operated restaurants and franchised stores. In 2012 AmRest acquired two unique brands operating in China- Blue Frog and Kabb.</p>
    <p>AmRest Coffee Deutschland Sp. z o.o. &amp; Co. KG is a sub company of AmRest Holdings SE, which operates almost 150 Starbucks Stores in Germany as licensee.</p>
  </div>
</div>
{% endcapture %}
{% include example.html content=example %}
