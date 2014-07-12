---
layout: page
title: Overview
---

### Individual or compiled

Plugins can be included individually (using Bootstrap's individual `*.js` files), or all at once (using `bootstrap.js` or the minified `bootstrap.min.js`).

<div class="bs-callout bs-callout-danger">
  <h4>Using the compiled JavaScript</h4>
  <p>Both <code>bootstrap.js</code> and <code>bootstrap.min.js</code> contain all plugins in a single file. Include only one.</p>
</div>

<div class="bs-callout bs-callout-danger">
  <h4>Component data attributes</h4>
  <p>Don't use data attributes from multiple plugins on the same element. For example, a button cannot both have a tooltip and toggle a modal. To accomplish this, use a wrapping element.</p>
</div>

<div class="bs-callout bs-callout-danger">
  <h4>Plugin dependencies</h4>
  <p>Some plugins and CSS components depend on other plugins. If you include plugins individually, make sure to check for these dependencies in the docs. Also note that all plugins depend on jQuery (this means jQuery must be included <strong>before</strong> the plugin files). <a href="{{ site.repo }}/blob/v{{ site.current_version }}/bower.json">Consult our <code>bower.json</code></a> to see which versions of jQuery are supported.</p>
</div>

### Data attributes

You can use all Bootstrap plugins purely through the markup API without writing a single line of JavaScript. This is Bootstrap's first-class API and should be your first consideration when using a plugin.

That said, in some situations it may be desirable to turn this functionality off. Therefore, we also provide the ability to disable the data attribute API by unbinding all events on the document namespaced with `data-api`. This looks like this:

{% highlight js %}
$(document).off('.data-api')
{% endhighlight %}

Alternatively, to target a specific plugin, just include the plugin's name as a namespace along with the data-api namespace like this:

{% highlight js %}
$(document).off('.alert.data-api')
{% endhighlight %}

### Programmatic API

We also believe you should be able to use all Bootstrap plugins purely through the JavaScript API. All public APIs are single, chainable methods, and return the collection acted upon.

{% highlight js %}
$('.btn.danger').button('toggle').addClass('fat')
{% endhighlight %}

All methods should accept an optional options object, a string which targets a particular method, or nothing (which initiates a plugin with default behavior):

{% highlight js %}
$('#myModal').modal()                      // initialized with defaults
$('#myModal').modal({ keyboard: false })   // initialized with no keyboard
$('#myModal').modal('show')                // initializes and invokes show immediately
{% endhighlight %}

Each plugin also exposes its raw constructor on a `Constructor` property: `$.fn.popover.Constructor`. If you'd like to get a particular plugin instance, retrieve it directly from an element: `$('[rel="popover"]').data('popover')`.

### No conflict

Sometimes it is necessary to use Bootstrap plugins with other UI frameworks. In these circumstances, namespace collisions can occasionally occur. If this happens, you may call `.noConflict` on the plugin you wish to revert the value of.

{% highlight js %}
var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
$.fn.bootstrapBtn = bootstrapButton            // give $().bootstrapBtn the Bootstrap functionality
{% endhighlight %}

### Events

Bootstrap provides custom events for most plugins' unique actions. Generally, these come in an infinitive and past participle form - where the infinitive (ex. `show`) is triggered at the start of an event, and its past participle form (ex. `shown`) is triggered on the completion of an action.

As of 3.0.0, all Bootstrap events are namespaced.

All infinitive events provide `preventDefault` functionality. This provides the ability to stop the execution of an action before it starts.

{% highlight js %}
$('#myModal').on('show.bs.modal', function (e) {
  if (!data) return e.preventDefault() // stops modal from being shown
})
{% endhighlight %}

<div class="bs-callout bs-callout-warning" id="callout-third-party-libs">
  <h4>Third-party libraries</h4>
  <p><strong>Bootstrap does not officially support third-party JavaScript libraries</strong> like Prototype or jQuery UI. Despite <code>.noConflict</code> and namespaced events, there may be compatibility problems that you need to fix on your own.</p>
</div>
