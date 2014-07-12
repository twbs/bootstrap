---
layout: page
title: Srollspy
---

## Example in navbar

The ScrollSpy plugin is for automatically updating nav targets based on scroll position. Scroll the area below the navbar and watch the active class change. The dropdown sub items will be highlighted as well.

<div class="bs-example">
  <nav id="navbar-example2" class="navbar navbar-default navbar-static" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-example-js-navbar-scrollspy">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Project Name</a>
      </div>
      <div class="collapse navbar-collapse bs-example-js-navbar-scrollspy">
        <ul class="nav navbar-nav">
          <li><a href="#fat">@fat</a></li>
          <li><a href="#mdo">@mdo</a></li>
          <li class="dropdown">
            <a href="#" id="navbarDrop1" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>
            <ul class="dropdown-menu" role="menu" aria-labelledby="navbarDrop1">
              <li><a href="#one" tabindex="-1">one</a></li>
              <li><a href="#two" tabindex="-1">two</a></li>
              <li class="divider"></li>
              <li><a href="#three" tabindex="-1">three</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div data-spy="scroll" data-target="#navbar-example2" data-offset="0" class="scrollspy-example">
    <h4 id="fat">@fat</h4>
    <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
    <h4 id="mdo">@mdo</h4>
    <p>Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard. Freegan beard aliqua cupidatat mcsweeney's vero. Cupidatat four loko nisi, ea helvetica nulla carles. Tattooed cosby sweater food truck, mcsweeney's quis non freegan vinyl. Lo-fi wes anderson +1 sartorial. Carles non aesthetic exercitation quis gentrify. Brooklyn adipisicing craft beer vice keytar deserunt.</p>
    <h4 id="one">one</h4>
    <p>Occaecat commodo aliqua delectus. Fap craft beer deserunt skateboard ea. Lomo bicycle rights adipisicing banh mi, velit ea sunt next level locavore single-origin coffee in magna veniam. High life id vinyl, echo park consequat quis aliquip banh mi pitchfork. Vero VHS est adipisicing. Consectetur nisi DIY minim messenger bag. Cred ex in, sustainable delectus consectetur fanny pack iphone.</p>
    <h4 id="two">two</h4>
    <p>In incididunt echo park, officia deserunt mcsweeney's proident master cleanse thundercats sapiente veniam. Excepteur VHS elit, proident shoreditch +1 biodiesel laborum craft beer. Single-origin coffee wayfarers irure four loko, cupidatat terry richardson master cleanse. Assumenda you probably haven't heard of them art party fanny pack, tattooed nulla cardigan tempor ad. Proident wolf nesciunt sartorial keffiyeh eu banh mi sustainable. Elit wolf voluptate, lo-fi ea portland before they sold out four loko. Locavore enim nostrud mlkshk brooklyn nesciunt.</p>
    <h4 id="three">three</h4>
    <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
    <p>Keytar twee blog, culpa messenger bag marfa whatever delectus food truck. Sapiente synth id assumenda. Locavore sed helvetica cliche irony, thundercats you probably haven't heard of them consequat hoodie gluten-free lo-fi fap aliquip. Labore elit placeat before they sold out, terry richardson proident brunch nesciunt quis cosby sweater pariatur keffiyeh ut helvetica artisan. Cardigan craft beer seitan readymade velit. VHS chambray laboris tempor veniam. Anim mollit minim commodo ullamco thundercats.
    </p>
  </div>
</div>


## Usage

### Requires relative positioning

No matter the implementation method, scrollspy requires the use of `position: relative;` on the element you're spying on. In most cases this is the `<body>`.

### Via data attributes

To easily add scrollspy behavior to your topbar navigation, add `data-spy="scroll"` to the element you want to spy on (most typically this would be the `<body>`). Then add the `data-target` attribute with the ID or class of the parent element of any Bootstrap `.nav` component.

{% highlight css %}
body {
  position: relative;
}
{% endhighlight %}

{% highlight html %}
<body data-spy="scroll" data-target=".navbar-example">
  ...
  <div class="navbar-example">
    <ul class="nav nav-tabs" role="tablist">
      ...
    </ul>
  </div>
  ...
</body>
{% endhighlight %}

### Via JavaScript

After adding `position: relative;` in your CSS, call the scrollspy via JavaScript:

{% highlight js %}
$('body').scrollspy({ target: '.navbar-example' })
{% endhighlight %}

<div class="bs-callout bs-callout-danger">
  <h4>Resolvable ID targets required</h4>
  <p>Navbar links must have resolvable id targets. For example, a <code>&lt;a href="#home"&gt;home&lt;/a&gt;</code> must correspond to something in the DOM like <code>&lt;div id="home"&gt;&lt;/div&gt;</code>.</p>
</div>

<div class="bs-callout bs-callout-info">
  <h4>Non-<code>:visible</code> target elements ignored</h4>
  <p>Target elements that are not <a href="http://api.jquery.com/visible-selector/"><code>:visible</code> according to jQuery</a> will be ignored and their corresponding nav items will never be highlighted.</p>
</div>

### Methods

#### .scrollspy('refresh')

When using scrollspy in conjunction with adding or removing of elements from the DOM, you'll need to call the refresh method like so:

{% highlight js %}
$('[data-spy="scroll"]').each(function () {
  var $spy = $(this).scrollspy('refresh')
})
{% endhighlight %}


### Options

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-offset=""`.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 100px;">Name</th>
       <th style="width: 100px;">type</th>
       <th style="width: 50px;">default</th>
       <th>description</th>
     </tr>
    </thead>
    <tbody>
     <tr>
       <td>offset</td>
       <td>number</td>
       <td>10</td>
       <td>Pixels to offset from top when calculating position of scroll.</td>
     </tr>
    </tbody>
  </table>
</div>

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
       <td>activate.bs.scrollspy</td>
       <td>This event fires whenever a new item becomes activated by the scrollspy.</td>
    </tr>
    </tbody>
  </table>
</div>
{% highlight js %}
$('#myScrollspy').on('activate.bs.scrollspy', function () {
  // do something…
})
{% endhighlight %}
