---
layout: page
title: Contents
---

Bootstrap is downloadable in two forms, within which you'll find the following directories and files, logically grouping common resources and providing both compiled and minified variations.

<div class="bs-callout bs-callout-warning" id="jquery-required">
  <h4>jQuery required</h4>
  <p>Please note that <strong>all JavaScript plugins require jQuery</strong> to be included, as shown in the <a href="#template">starter template</a>. <a href="{{ site.repo }}/blob/v{{ site.current_version }}/bower.json">Consult our <code>bower.json</code></a> to see which versions of jQuery are supported.</p>
</div>

### Precompiled Bootstrap

Once downloaded, unzip the compressed folder to see the structure of (the compiled) Bootstrap. You'll see something like this:

<!-- NOTE: This info is intentionally duplicated in the README. Copy any changes made here over to the README too. -->

{% highlight bash %}
bootstrap/
├── css/
│   ├── bootstrap.css
│   ├── bootstrap.css.map
│   ├── bootstrap.min.css
└── js/
    ├── bootstrap.js
    └── bootstrap.min.js
{% endhighlight %}

This is the most basic form of Bootstrap: precompiled files for quick drop-in usage in nearly any web project. We provide compiled CSS and JS (`bootstrap.*`), as well as compiled and minified CSS and JS (`bootstrap.min.*`). CSS [source maps](https://developers.google.com/chrome-developer-tools/docs/css-preprocessors) (`bootstrap.*.map`) are available for use with certain browsers' developer tools.

### Bootstrap source code

The Bootstrap source code download includes the precompiled CSS and JavaScript assets, along with source Less, JavaScript, and documentation. More specifically, it includes the following and more:

{% highlight bash %}
bootstrap/
├── dist/
│   ├── css/
│   └── js/
├── docs/
│   └── examples/
├── js/
└── less/
{% endhighlight %}

The `less/` and `js/` are the source code for our CSS and JavaScript. The `dist/` folder includes everything listed in the precompiled download section above. The `docs/` folder includes the source code for our documentation, and `examples/` of Bootstrap usage. Beyond that, any other included file provides support for packages, license information, and development.
