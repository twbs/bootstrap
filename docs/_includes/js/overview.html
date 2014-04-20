<div class="bs-docs-section">
  <h1 id="js-overview" class="page-header">Overview</h1>

  <h3 id="js-individual-compiled">Individual or compiled</h3>
  <p>Plugins can be included individually (using Bootstrap's individual <code>*.js</code> files), or all at once (using <code>bootstrap.js</code> or the minified <code>bootstrap.min.js</code>).</p>

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

  <h3 id="js-data-attrs">Data attributes</h3>
  <p>You can use all Bootstrap plugins purely through the markup API without writing a single line of JavaScript. This is Bootstrap's first-class API and should be your first consideration when using a plugin.</p>

  <p>That said, in some situations it may be desirable to turn this functionality off. Therefore, we also provide the ability to disable the data attribute API by unbinding all events on the document namespaced with <code>data-api</code>. This looks like this:</p>
{% highlight js %}
$(document).off('.data-api')
{% endhighlight %}

  <p>Alternatively, to target a specific plugin, just include the plugin's name as a namespace along with the data-api namespace like this:</p>
{% highlight js %}
$(document).off('.alert.data-api')
{% endhighlight %}

  <h3 id="js-programmatic-api">Programmatic API</h3>
  <p>We also believe you should be able to use all Bootstrap plugins purely through the JavaScript API. All public APIs are single, chainable methods, and return the collection acted upon.</p>
{% highlight js %}
$('.btn.danger').button('toggle').addClass('fat')
{% endhighlight %}

  <p>All methods should accept an optional options object, a string which targets a particular method, or nothing (which initiates a plugin with default behavior):</p>
{% highlight js %}
$('#myModal').modal()                      // initialized with defaults
$('#myModal').modal({ keyboard: false })   // initialized with no keyboard
$('#myModal').modal('show')                // initializes and invokes show immediately
{% endhighlight %}

  <p>Each plugin also exposes its raw constructor on a <code>Constructor</code> property: <code>$.fn.popover.Constructor</code>. If you'd like to get a particular plugin instance, retrieve it directly from an element: <code>$('[rel="popover"]').data('popover')</code>.</p>

  <h3 id="js-noconflict">No conflict</h3>
  <p>Sometimes it is necessary to use Bootstrap plugins with other UI frameworks. In these circumstances, namespace collisions can occasionally occur. If this happens, you may call <code>.noConflict</code> on the plugin you wish to revert the value of.</p>
{% highlight js %}
var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
$.fn.bootstrapBtn = bootstrapButton            // give $().bootstrapBtn the Bootstrap functionality
{% endhighlight %}

  <h3 id="js-events">Events</h3>
  <p>Bootstrap provides custom events for most plugins' unique actions. Generally, these come in an infinitive and past participle form - where the infinitive (ex. <code>show</code>) is triggered at the start of an event, and its past participle form (ex. <code>shown</code>) is triggered on the completion of an action.</p>
  <p>As of 3.0.0, all Bootstrap events are namespaced.</p>
  <p>All infinitive events provide <code>preventDefault</code> functionality. This provides the ability to stop the execution of an action before it starts.</p>
{% highlight js %}
$('#myModal').on('show.bs.modal', function (e) {
  if (!data) return e.preventDefault() // stops modal from being shown
})
{% endhighlight %}

  <div class="bs-callout bs-callout-warning" id="callout-third-party-libs">
    <h4>Third-party libraries</h4>
    <p><strong>Bootstrap does not officially support third-party JavaScript libraries</strong> like Prototype or jQuery UI. Despite <code>.noConflict</code> and namespaced events, there may be compatibility problems that you need to fix on your own.</p>
  </div>
</div>
