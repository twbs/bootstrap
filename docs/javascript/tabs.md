---
layout: page
title: Tabs
---

## Example

Add quick, dynamic tab functionality to transition through panes of local content, even via dropdown menus.

<div class="bs-example bs-example-tabs">
  <ul id="myTab" class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">Home</a></li>
    <li role="presentation"><a href="#profile" role="tab" data-toggle="tab">Profile</a></li>
    <li role="presentation" class="dropdown">
      <a href="#" id="myTabDrop1" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>
      <ul class="dropdown-menu" role="menu" aria-labelledby="myTabDrop1">
        <li><a href="#dropdown1" tabindex="-1" role="tab" data-toggle="tab">@fat</a></li>
        <li><a href="#dropdown2" tabindex="-1" role="tab" data-toggle="tab">@mdo</a></li>
      </ul>
    </li>
  </ul>
  <div id="myTabContent" class="tab-content">
    <div role="tabpanel" class="tab-pane fade in active" id="home">
      <p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
    </div>
    <div role="tabpanel" class="tab-pane fade" id="profile">
      <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
    </div>
    <div role="tabpanel" class="tab-pane fade" id="dropdown1">
      <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork. Williamsburg banh mi whatever gluten-free, carles pitchfork biodiesel fixie etsy retro mlkshk vice blog. Scenester cred you probably haven't heard of them, vinyl craft beer blog stumptown. Pitchfork sustainable tofu synth chambray yr.</p>
    </div>
    <div role="tabpanel" class="tab-pane fade" id="dropdown2">
      <p>Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater. Lomo wolf viral, mustache readymade thundercats keffiyeh craft beer marfa ethical. Wolf salvia freegan, sartorial keffiyeh echo park vegan.</p>
    </div>
  </div>
</div>

<div class="bs-callout bs-callout-info">
  <h4>Extends tabbed navigation</h4>
  <p>This plugin extends the <a href="../components/#nav-tabs">tabbed navigation component</a> to add tabbable areas.</p>
</div>

## Usage

Enable tabbable tabs via JavaScript (each tab needs to be activated individually):

{% highlight js %}
$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
{% endhighlight %}

You can activate individual tabs in several ways:

{% highlight js %}
$('#myTab a[href="#profile"]').tab('show') // Select tab by name
$('#myTab a:first').tab('show') // Select first tab
$('#myTab a:last').tab('show') // Select last tab
$('#myTab li:eq(2) a').tab('show') // Select third tab (0-indexed)
{% endhighlight %}

### Markup

You can activate a tab or pill navigation without writing any JavaScript by simply specifying `data-toggle="tab"` or `data-toggle="pill"` on an element. Adding the `.nav` and `.nav-tabs` classes to the tab `<ul>` will apply the Bootstrap <a href="../components/#nav-tabs">tab styling</a>, while adding the `.nav` and `.nav-pills` classes will apply <a href="../components/#nav-pills">pill styling</a>.

{% highlight html %}
<!-- Nav tabs -->
<ul class="nav nav-tabs" role="tablist">
  <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">Home</a></li>
  <li role="presentation"><a href="#profile" role="tab" data-toggle="tab">Profile</a></li>
  <li role="presentation"><a href="#messages" role="tab" data-toggle="tab">Messages</a></li>
  <li role="presentation"><a href="#settings" role="tab" data-toggle="tab">Settings</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="home">...</div>
  <div role="tabpanel" class="tab-pane" id="profile">...</div>
  <div role="tabpanel" class="tab-pane" id="messages">...</div>
  <div role="tabpanel" class="tab-pane" id="settings">...</div>
</div>
{% endhighlight %}

### Fade effect

To make tabs fade in, add `.fade` to each `.tab-pane`. The first tab pane must also have `.in to properly fade in initial content.

{% highlight html %}
<div class="tab-content">
  <div role="tabpanel" class="tab-pane fade in active" id="home">...</div>
  <div role="tabpanel" class="tab-pane fade" id="profile">...</div>
  <div role="tabpanel" class="tab-pane fade" id="messages">...</div>
  <div role="tabpanel" class="tab-pane fade" id="settings">...</div>
</div>
{% endhighlight %}

### Methods

#### $().tab

Activates a tab element and content container. Tab should have either a `data-target` or an `href` targeting a container node in the DOM.

{% highlight html %}
<ul class="nav nav-tabs" role="tablist" id="myTab">
  <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">Home</a></li>
  <li role="presentation"><a href="#profile" role="tab" data-toggle="tab">Profile</a></li>
  <li role="presentation"><a href="#messages" role="tab" data-toggle="tab">Messages</a></li>
  <li role="presentation"><a href="#settings" role="tab" data-toggle="tab">Settings</a></li>
</ul>

<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="home">...</div>
  <div role="tabpanel" class="tab-pane" id="profile">...</div>
  <div role="tabpanel" class="tab-pane" id="messages">...</div>
  <div role="tabpanel" class="tab-pane" id="settings">...</div>
</div>

<script>
  $(function () {
    $('#myTab a:last').tab('show')
  })
</script>
{% endhighlight %}

### Events

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
       <td>show.bs.tab</td>
       <td>This event fires on tab show, but before the new tab has been shown. Use <code>event.target</code> and <code>event.relatedTarget</code> to target the active tab and the previous active tab (if available) respectively.</td>
    </tr>
    <tr>
       <td>shown.bs.tab</td>
       <td>This event fires on tab show after a tab has been shown. Use <code>event.target</code> and <code>event.relatedTarget</code> to target the active tab and the previous active tab (if available) respectively.</td>
     </tr>
    </tbody>
  </table>
</div>

{% highlight js %}
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  e.target // activated tab
  e.relatedTarget // previous tab
})
{% endhighlight %}
