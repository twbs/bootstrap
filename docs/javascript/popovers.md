<div class="bs-docs-section">
  <h1 id="popovers" class="page-header">Popovers <small>popover.js</small></h1>

  <h2 id="popovers-examples">Examples</h2>
  <p>Add small overlays of content, like those on the iPad, to any element for housing secondary information.</p>

  <div class="bs-callout bs-callout-danger">
    <h4>Plugin dependency</h4>
    <p>Popovers require the <a href="#tooltips">tooltip plugin</a> to be included in your version of Bootstrap.</p>
  </div>
  <div class="bs-callout bs-callout-danger">
    <h4>Opt-in functionality</h4>
    <p>For performance reasons, the Tooltip and Popover data-apis are opt-in, meaning <strong>you must initialize them yourself</strong>.</p>
  </div>
  <div class="bs-callout bs-callout-warning">
    <h4>Popovers in button groups and input groups require special setting</h4>
    <p>When using popovers on elements within a <code>.btn-group</code> or an <code>.input-group</code>, you'll have to specify the option <code>container: 'body'</code> (documented below) to avoid unwanted side effects (such as the element growing wider and/or losing its rounded corners when the popover is triggered).</p>
  </div>
  <div class="bs-callout bs-callout-warning">
    <h4>Don't try to show popovers on hidden elements</h4>
    <p>Invoking <code>$(...).popover('show')</code> when the target element is <code>display: none;</code> will cause the popover to be incorrectly positioned.</p>
  </div>
  <div class="bs-callout bs-callout-info">
    <h4>Popovers on disabled elements require wrapper elements</h4>
    <p>To add a popover to a <code>disabled</code> or <code>.disabled</code> element, put the element inside of a <code>&lt;div&gt;</code> and apply the popover to that <code>&lt;div&gt;</code> instead.</p>
  </div>

  <h3>Static popover</h3>
  <p>Four options are available: top, right, bottom, and left aligned.</p>
  <div class="bs-example bs-example-popover">
    <div class="popover top">
      <div class="arrow"></div>
      <h3 class="popover-title">Popover top</h3>
      <div class="popover-content">
        <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
      </div>
    </div>

    <div class="popover right">
      <div class="arrow"></div>
      <h3 class="popover-title">Popover right</h3>
      <div class="popover-content">
        <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
      </div>
    </div>

    <div class="popover bottom">
      <div class="arrow"></div>
      <h3 class="popover-title">Popover bottom</h3>

      <div class="popover-content">
        <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
      </div>
    </div>

    <div class="popover left">
      <div class="arrow"></div>
      <h3 class="popover-title">Popover left</h3>
      <div class="popover-content">
        <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
      </div>
    </div>

    <div class="clearfix"></div>
  </div>

  <h3>Live demo</h3>
  <div class="bs-example" style="padding-bottom: 24px;">
    <button type="button" class="btn btn-lg btn-danger bs-docs-popover" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
  </div>
{% highlight html %}
<button type="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
{% endhighlight %}

  <h4>Four directions</h4>
  <div class="bs-example popover-demo">
    <div class="bs-example-popovers">
      <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
        Popover on left
      </button>
      <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
        Popover on top
      </button>
      <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
        Popover on bottom
      </button>
      <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
        Popover on right
      </button>
    </div>
  </div><!-- /example -->
{% highlight html %}
<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on left
</button>

<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on top
</button>

<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus
sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on bottom
</button>

<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on right
</button>
{% endhighlight %}

  <h4>Dismiss on next click</h4>
  <p>Use the <code>focus</code> trigger to dismiss popovers on the next click that the user makes.</p>
  <div class="bs-example" style="padding-bottom: 24px;">
    <button type="button" class="btn btn-lg btn-danger bs-docs-popover-dismiss" data-toggle="popover" title="Dismissible popover" data-content="And here's some amazing content. It's very engaging. Right?">Dismissible popover</button>
  </div>
{% highlight html %}
<button type="button" class="btn btn-lg btn-danger popover-dismiss" data-toggle="popover" title="Dismissible popover" data-content="And here's some amazing content. It's very engaging. Right?">Dismissible popover</button>
{% endhighlight %}
{% highlight js %}
$('.popover-dismiss').popover({
  trigger: 'focus'
})
{% endhighlight %}

  <div class="bs-callout bs-callout-warning">
    <h4>Multiple-line links</h4>
    <p>Sometimes you want to add a popover to a hyperlink that wraps multiple lines. The default behavior of the popover plugin is to center it horizontally and vertically. Add <code>white-space: nowrap;</code> to your anchors to avoid this.</p>
  </div>


  <h2 id="popovers-usage">Usage</h2>
  <p>Enable popovers via JavaScript:</p>
  {% highlight js %}$('#example').popover(options){% endhighlight %}

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
          <td>Apply a CSS fade transition to the popover</td>
        </tr>
        <tr>
          <td>container</td>
          <td>string | false</td>
          <td>false</td>
          <td>
           <p>Appends the popover to a specific element. Example: <code>container: 'body'</code>. This option is particularly useful in that it allows you to position the popover in the flow of the document near the triggering element - which will prevent the popover from floating away from the triggering element during a window resize.</p>
          </td>
        </tr>
        <tr>
          <td>content</td>
          <td>string | function</td>
          <td>''</td>
          <td>
            <p>Default content value if <code>data-content</code> attribute isn't present.</p>
            <p>If a function is given, it will be called with 1 argument, which is the element that the popover is attached to.</p>
          </td>
        </tr>
        <tr>
          <td>delay</td>
          <td>number | object</td>
          <td>0</td>
          <td>
           <p>Delay showing and hiding the popover (ms) - does not apply to manual trigger type</p>
           <p>If a number is supplied, delay is applied to both hide/show</p>
           <p>Object structure is: <code>delay: { "show": 500, "hide": 100 }</code></p>
          </td>
        </tr>
        <tr>
          <td>html</td>
          <td>boolean</td>
          <td>false</td>
          <td>Insert HTML into the popover. If false, jQuery's <code>text</code> method will be used to insert content into the DOM. Use text if you're worried about XSS attacks.</td>
        </tr>
        <tr>
          <td>placement</td>
          <td>string | function</td>
          <td>'right'</td>
          <td>How to position the popover - top | bottom | left | right | auto.<br> When "auto" is specified, it will dynamically reorient the popover. For example, if placement is "auto left", the popover will display to the left when possible, otherwise it will display right.</td>
        </tr>
        <tr>
          <td>selector</td>
          <td>string</td>
          <td>false</td>
          <td>If a selector is provided, popover objects will be delegated to the specified targets. In practice, this is used to enable dynamic HTML content to have popovers added. See <a href="https://github.com/twbs/bootstrap/issues/4215">this</a> and <a href="http://jsfiddle.net/fScua/">an informative example</a>.</td>
        </tr>
        <tr>
          <td>template</td>
          <td>string</td>
          <td><code>'&lt;div class="popover" role="tooltip"&gt;&lt;div class="arrow"&gt;&lt;/div&gt;&lt;h3 class="popover-title"&gt;&lt;/h3&gt;&lt;div class="popover-content"&gt;&lt;/div&gt;&lt;/div&gt;'</code></td>
          <td>
           <p>Base HTML to use when creating the popover.</p>
           <p>The popover's <code>title</code> will be injected into the <code>.popover-title</code>.</p>
           <p>The popover's <code>content</code> will be injected into the <code>.popover-content</code>.</p>
           <p><code>.arrow</code> will become the popover's arrow.</p>
           <p>The outermost wrapper element should have the <code>.popover</code> class.</p>
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
          <td>'click'</td>
          <td>How popover is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.</td>
        </tr>
        <tr>
         <td>viewport</td>
         <td>string | object</td>
         <td>{ selector: 'body', padding: 0 }</td>
         <td>
          <p>Keeps the popover within the bounds of this element. Example: <code>viewport: '#viewport'</code> or <code>{ "selector": "#viewport", "padding": 0 }</code></p>
         </td>
       </tr>
      </tbody>
    </table>
  </div><!-- /.table-responsive -->
  <div class="bs-callout bs-callout-info">
    <h4>Data attributes for individual popovers</h4>
    <p>Options for individual popovers can alternatively be specified through the use of data attributes, as explained above.</p>
  </div>

  <h3>Methods</h3>
  <h4>$().popover(options)</h4>
  <p>Initializes popovers for an element collection.</p>

  <h4>.popover('show')</h4>
  <p>Reveals an elements popover.</p>
  {% highlight js %}$('#element').popover('show'){% endhighlight %}

  <h4>.popover('hide')</h4>
  <p>Hides an elements popover.</p>
  {% highlight js %}$('#element').popover('hide'){% endhighlight %}

  <h4>.popover('toggle')</h4>
  <p>Toggles an elements popover.</p>
  {% highlight js %}$('#element').popover('toggle'){% endhighlight %}

  <h4>.popover('destroy')</h4>
  <p>Hides and destroys an element's popover.</p>
  {% highlight js %}$('#element').popover('destroy'){% endhighlight %}
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
         <td>show.bs.popover</td>
         <td>This event fires immediately when the <code>show</code> instance method is called.</td>
       </tr>
       <tr>
         <td>shown.bs.popover</td>
         <td>This event is fired when the popover has been made visible to the user (will wait for CSS transitions to complete).</td>
       </tr>
       <tr>
         <td>hide.bs.popover</td>
         <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
       </tr>
       <tr>
         <td>hidden.bs.popover</td>
         <td>This event is fired when the popover has finished being hidden from the user (will wait for CSS transitions to complete).</td>
       </tr>
      </tbody>
    </table>
  </div><!-- /.table-responsive -->
{% highlight js %}
$('#myPopover').on('hidden.bs.popover', function () {
  // do something…
})
{% endhighlight %}
</div>
