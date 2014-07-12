<div class="bs-docs-section">
  <h1 id="third-parties" class="page-header">Third party support</h1>
  <p class="lead">While we don't officially support any third party plugins or add-ons, we do offer some useful advice to help avoid potential issues in your projects.</p>

  <h3 id="third-box-sizing">Box-sizing</h3>
  <p>Some third party software, including Google Maps and Google Custom Search Engine, conflict with Bootstrap due to <code>* { box-sizing: border-box; }</code>, a rule which makes it so <code>padding</code> does not affect the final computed width of an element. Learn more about <a href="http://css-tricks.com/box-sizing/">box model and sizing at CSS Tricks</a>.</p>
  <p>Depending on the context, you may override as-needed (Option 1) or reset the box-sizing for entire regions (Option 2).</p>
{% highlight scss %}
/* Box-sizing resets
 *
 * Reset individual elements or override regions to avoid conflicts due to
 * global box model settings of Bootstrap. Two options, individual overrides and
 * region resets, are available as plain CSS and uncompiled Less formats.
 */

/* Option 1A: Override a single element's box model via CSS */
.element {
  -webkit-box-sizing: content-box;
     -moz-box-sizing: content-box;
          box-sizing: content-box;
}

/* Option 1B: Override a single element's box model by using a Bootstrap Less mixin */
.element {
  .box-sizing(content-box);
}

/* Option 2A: Reset an entire region via CSS */
.reset-box-sizing,
.reset-box-sizing *,
.reset-box-sizing *:before,
.reset-box-sizing *:after {
  -webkit-box-sizing: content-box;
     -moz-box-sizing: content-box;
          box-sizing: content-box;
}

/* Option 2B: Reset an entire region with a custom Less mixin */
.reset-box-sizing {
  &,
  *,
  *:before,
  *:after {
    .box-sizing(content-box);
  }
}
.element {
  .reset-box-sizing();
}
{% endhighlight %}
</div>
