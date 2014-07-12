<div class="bs-docs-section">
  <h1 id="tooltips" class="page-header">Tooltips <small>tooltip.js</small></h1>

  <h2 id="tooltips-examples">Examples</h2>
  <p>Inspired by the excellent jQuery.tipsy plugin written by Jason Frame; Tooltips are an updated version, which don't rely on images, use CSS3 for animations, and data-attributes for local title storage.</p>
  <p>Hover over the links below to see tooltips:</p>
  <div class="bs-example tooltip-demo">
    <p class="muted" style="margin-bottom: 0;">Tight pants next level keffiyeh <a href="#" data-toggle="tooltip" title="Default tooltip">you probably</a> haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel <a href="#" data-toggle="tooltip" title="Another tooltip">have a</a> terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko mcsweeney's cleanse vegan chambray. A really ironic artisan <a href="#" data-toggle="tooltip" title="Another one here too">whatever keytar</a>, scenester farm-to-table banksy Austin <a href="#" data-toggle="tooltip" title="The last tip!">twitter handle</a> freegan cred raw denim single-origin coffee viral.
    </p>
  </div><!-- /example -->

  <h3>Four directions</h3>
  <div class="bs-example tooltip-demo">
    <div class="bs-example-tooltips">
      <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>
      <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>
      <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>
      <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</button>
    </div>
  </div><!-- /example -->
{% highlight html %}
<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>

<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</button>

<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>

<button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</button>
{% endhighlight %}

  <div class="bs-callout bs-callout-danger">
    <h4>Opt-in functionality</h4>
    <p>For performance reasons, the Tooltip and Popover data-apis are opt-in, meaning <strong>you must initialize them yourself</strong>.</p>
  </div>
  <div class="bs-callout bs-callout-warning">
    <h4>Tooltips in button groups and input groups require special setting</h4>
    <p>When using tooltips on elements within a <code>.btn-group</code> or an <code>.input-group</code>, you'll have to specify the option <code>container: 'body'</code> (documented below) to avoid unwanted side effects (such as the element growing wider and/or losing its rounded corners when the tooltip is triggered).</p>
  </div>
  <div class="bs-callout bs-callout-warning">
    <h4>Don't try to show tooltips on hidden elements</h4>
    <p>Invoking <code>$(...).tooltip('show')</code> when the target element is <code>display: none;</code> will cause the tooltip to be incorrectly positioned.</p>
  </div>
  <div class="bs-callout bs-callout-info">
    <h4>Tooltips on disabled elements require wrapper elements</h4>
    <p>To add a tooltip to a <code>disabled</code> or <code>.disabled</code> element, put the element inside of a <code>&lt;div&gt;</code> and apply the tooltip to that <code>&lt;div&gt;</code> instead.</p>
  </div>

  <h2 id="tooltips-usage">Usage</h2>
  <p>The tooltip plugin generates content and markup on demand, and by default places tooltips after their trigger element.</p>
  <p>Trigger the tooltip via JavaScript:</p>
{% highlight js %}
$('#example').tooltip(options)
{% endhighlight %}

  <h3>Markup</h3>
  <p>The required markup for a tooltip is only a <code>data</code> attribute and <code>title</code> on the HTML element you wish to have a tooltip. The generated markup of a tooltip is rather simple, though it does require a position (by default, set to <code>top</code> by the plugin).</p>
  <div class="bs-callout bs-callout-warning">
    <h4>Multiple-line links</h4>
    <p>Sometimes you want to add a tooltip to a hyperlink that wraps multiple lines. The default behavior of the tooltip plugin is to center it horizontally and vertically. Add <code>white-space: nowrap;</code> to your anchors to avoid this.</p>
  </div>
{% highlight html %}
<!-- HTML to write -->
<a href="#" data-toggle="tooltip" title="Some tooltip text!">Hover over me</a>

<!-- Generated markup by the plugin -->
<div class="tooltip top" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">
    Some tooltip text!
  </div>
</div>
{% endhighlight %}

  <h3>Options</h3>
  <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-animation=""</code>.</p>
  <div class="table-responsive">
    <table class="table table-bordered table-striped">
      <thead>
       <tr>
         <th style="width: 100px;">Name</th>
         <th style="width: 100px;">Type</th>
         <th style="width: 50px;">Default</th>
         <th>Description</th>
       </tr>
      </thead>
      <tbody>
       <tr>
         <td>animation</td>
         <td>boolean</td>
         <td>true</td>
         <td>Apply a CSS fade transition to the tooltip</td>
       </tr>
       <tr>
         <td>container</td>
         <td>string | false</td>
         <td>false</td>
         <td>
          <p>Appends the tooltip to a specific element. Example: <code>container: 'body'</code>. This option is particularly useful in that it allows you to position the tooltip in the flow of the document near the triggering element - which will prevent the tooltip from floating away from the triggering element during a window resize.</p>
         </td>
       </tr>
       <tr>
         <td>delay</td>
         <td>number | object</td>
         <td>0</td>
         <td>
          <p>Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type</p>
          <p>If a number is supplied, delay is applied to both hide/show</p>
          <p>Object structure is: <code>delay: { "show": 500, "hide": 100 }</code></p>
         </td>
       </tr>
       <tr>
         <td>html</td>
         <td>boolean</td>
         <td>false</td>
         <td>Insert HTML into the tooltip. If false, jQuery's <code>text</code> method will be used to insert content into the DOM. Use text if you're worried about XSS attacks.</td>
       </tr>
       <tr>
         <td>placement</td>
         <td>string | function</td>
         <td>'top'</td>
         <td>How to position the tooltip - top | bottom | left | right | auto. <br> When "auto" is specified, it will dynamically reorient the tooltip. For example, if placement is "auto left", the tooltip will display to the left when possible, otherwise it will display right.</td>
       </tr>
       <tr>
         <td>selector</td>
         <td>string</td>
         <td>false</td>
         <td>If a selector is provided, tooltip objects will be delegated to the specified targets. In practice, this is used to enable dynamic HTML content to have tooltips added. See <a href="https://github.com/twbs/bootstrap/issues/4215">this</a> and <a href="http://jsfiddle.net/fScua/">an informative example</a>.</td>
       </tr>
       <tr>
         <td>template</td>
         <td>string</td>
         <td><code>'&lt;div class="tooltip" role="tooltip"&gt;&lt;div class="tooltip-arrow"&gt;&lt;/div&gt;&lt;div class="tooltip-inner"&gt;&lt;/div&gt;&lt;/div&gt;'</code></td>
         <td>
          <p>Base HTML to use when creating the tooltip.</p>
          <p>The tooltip's <code>title</code> will be injected into the <code>.tooltip-inner</code>.</p>
          <p><code>.tooltip-arrow</code> will become the tooltip's arrow.</p>
          <p>The outermost wrapper element should have the <code>.tooltip</code> class.</p>
        </td>
       </tr>
       <tr>
         <td>title</td>
         <td>string | function</td>
         <td>''</td>
         <td>Default title value if <code>title</code> attribute isn't present</td>
       </tr>
       <tr>
         <td>trigger</td>
         <td>string</td>
         <td>'hover focus'</td>
         <td>How tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.</td>
       </tr>
       <tr>
         <td>viewport</td>
         <td>string | object</td>
         <td>{ selector: 'body', padding: 0 }</td>
         <td>
          <p>Keeps the tooltip within the bounds of this element. Example: <code>viewport: '#viewport'</code> or <code>{ "selector": "#viewport", "padding": 0 }</code></p>
         </td>
       </tr>
      </tbody>
    </table>
  </div><!-- /.table-responsive -->
  <div class="bs-callout bs-callout-info">
    <h4>Data attributes for individual tooltips</h4>
    <p>Options for individual tooltips can alternatively be specified through the use of data attributes, as explained above.</p>
  </div>

  <h3>Methods</h3>

  <h4>$().tooltip(options)</h4>
  <p>Attaches a tooltip handler to an element collection.</p>

  <h4>.tooltip('show')</h4>
  <p>Reveals an element's tooltip.</p>
  {% highlight js %}$('#element').tooltip('show'){% endhighlight %}

  <h4>.tooltip('hide')</h4>
  <p>Hides an element's tooltip.</p>
  {% highlight js %}$('#element').tooltip('hide'){% endhighlight %}

  <h4>.tooltip('toggle')</h4>
  <p>Toggles an element's tooltip.</p>
  {% highlight js %}$('#element').tooltip('toggle'){% endhighlight %}

  <h4>.tooltip('destroy')</h4>
  <p>Hides and destroys an element's tooltip.</p>
  {% highlight js %}$('#element').tooltip('destroy'){% endhighlight %}

  <h3>Events</h3>
  <div class="table-responsive">
    <table class="table table-bordered table-striped">
      <thead>
       <tr>
         <th style="width: 150px;">Event Type</th>
         <th>Description</th>
       </tr>
      </thead>
      <tbody>
       <tr>
         <td>show.bs.tooltip</td>
         <td>This event fires immediately when the <code>show</code> instance method is called.</td>
       </tr>
       <tr>
         <td>shown.bs.tooltip</td>
         <td>This event is fired when the tooltip has been made visible to the user (will wait for CSS transitions to complete).</td>
       </tr>
       <tr>
         <td>hide.bs.tooltip</td>
         <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
       </tr>
       <tr>
         <td>hidden.bs.tooltip</td>
         <td>This event is fired when the tooltip has finished being hidden from the user (will wait for CSS transitions to complete).</td>
       </tr>
      </tbody>
    </table>
  </div><!-- /.table-responsive -->
{% highlight js %}
$('#myTooltip').on('hidden.bs.tooltip', function () {
  // do something…
})
{% endhighlight %}
</div>
