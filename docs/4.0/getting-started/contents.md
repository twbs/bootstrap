---
layout: docs
title: Contents
description: Discover what's included in Bootstrap, including our precompiled and source code flavors. Remember, Bootstrap's JavaScript plugins require jQuery.
group: getting-started
toc: true
---

## Precompiled Bootstrap

Once downloaded, unzip the compressed folder and you'll see something like this:

<!-- NOTE: This info is intentionally duplicated in the README. Copy any changes made here over to the README too. -->

{% highlight plaintext %}
bootstrap/
├── css/
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap-grid.css
│   ├── bootstrap-grid.css.map
│   ├── bootstrap-grid.min.css
│   ├── bootstrap-grid.min.css.map
│   ├── bootstrap-reboot.css
│   ├── bootstrap-reboot.css.map
│   ├── bootstrap-reboot.min.css
│   └── bootstrap-reboot.min.css.map
└── js/
    ├── bootstrap.bundle.js
    ├── bootstrap.bundle.min.js
    ├── bootstrap.js
    └── bootstrap.min.js
{% endhighlight %}

This is the most basic form of Bootstrap: precompiled files for quick drop-in usage in nearly any web project. We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). CSS [source maps](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps) (`bootstrap.*.map`) are available for use with certain browsers' developer tools.

### Comparison of CSS files

<table class="table table-bordered table-responsive">
  <thead>
    <tr>
      <th scope="col">CSS files</th>
      <th scope="col" class="text-center">Layout</th>
      <th scope="col" class="text-center">Content</th>
      <th scope="col" class="text-center">Components</th>
      <th scope="col" class="text-center">Utilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">
        <div><code class="text-nowrap">bootstrap.css</code></div>
        <div><code class="text-nowrap">bootstrap.min.css</code></div>
      </th>
      <td class="table-success text-center align-middle">All</td>
      <td class="table-success text-center align-middle">All</td>
      <td class="table-success text-center align-middle">All</td>
      <td class="table-success text-center align-middle">All</td>
    </tr>
    <tr>
      <th scope="row">
        <div><code class="text-nowrap">bootstrap-grid.css</code></div>
        <div><code class="text-nowrap">bootstrap-grid.min.css</code></div>
      </th>
      <td class="table-warning text-center align-middle">Only <a href="{{ site.baseurl }}/docs/{{ site.docs_version }}/layout/grid/">grid</a> system</td>
      <td class="table-danger text-center align-middle">No</td>
      <td class="table-danger text-center align-middle">No</td>
      <td class="table-warning text-center align-middle">Only <a href="{{ site.baseurl }}/docs/{{ site.docs_version }}/utilities/flex/">flex</a> utilities</td>
    </tr>
    <tr>
      <th scope="row">
        <div><code class="text-nowrap">bootstrap-reboot.css</code></div>
        <div><code class="text-nowrap">bootstrap-reboot.min.css</code></div>
      </th>
      <td class="table-danger text-center align-middle">No</td>
      <td class="table-warning text-center align-middle">Only <a href="{{ site.baseurl }}/docs/{{ site.docs_version }}/content/reboot/">Reboot</a></td>
      <td class="table-danger text-center align-middle">No</td>
      <td class="table-danger text-center align-middle">No</td>
    </tr>
  </tbody>
</table>

## Bootstrap source code

The Bootstrap source code download includes the precompiled CSS and JavaScript assets, along with source Sass, JavaScript, and documentation. More specifically, it includes the following and more:

{% highlight plaintext %}
bootstrap/
├── dist/
│   ├── css/
│   └── js/
├── docs/
│   └── examples/
├── js/
└── scss/
{% endhighlight %}

The `scss/` and `js/` are the source code for our CSS and JavaScript. The `dist/` folder includes everything listed in the precompiled download section above. The `docs/` folder includes the source code for our documentation, and `examples/` of Bootstrap usage. Beyond that, any other included file provides support for packages, license information, and development.
