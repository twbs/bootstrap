---
layout: page
title: Browser and device support
---

Bootstrap is built to work best in the latest desktop and mobile browsers, meaning older browsers might display differently styled, though fully functional, renderings of certain components.

### Supported browsers

Bootstrap supports the **latest, stable releases** of all major browsers and platforms. On Windows, **we support Internet Explorer 9-11**. More specific support information is provided below.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <td></td>
        <th>Chrome</th>
        <th>Firefox</th>
        <th>Internet Explorer</th>
        <th>Opera</th>
        <th>Safari</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Android</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-muted" rowspan="3" style="vertical-align: middle;">N/A</td>
        <td class="text-danger">Not supported</td>
        <td class="text-muted">N/A</td>
      </tr>
      <tr>
        <th>iOS</th>
        <td class="text-success">Supported</td>
        <td class="text-muted">N/A</td>
        <td class="text-danger">Not supported</td>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th>Mac OS X</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th>Windows</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-danger">Not supported</td>
      </tr>
    </tbody>
  </table>
</div>

Unofficially, Bootstrap should look and behave well enough in Chromium and Chrome for Linux, Firefox for Linux, and Internet Explorer 7, though they are not officially supported.

For a list of some of the browser bugs that Bootstrap has to grapple with, see our [Wall of browser bugs](../browser-bugs/).

### Internet Explorer 9

Internet Explorer 9 is also supported, however, please be aware that some CSS3 properties and HTML5 elements are not fully supported.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th scope="col">Feature</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row"><code>border-radius</code></th>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th scope="row"><code>box-shadow</code></th>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th scope="row"><code>transform</code></th>
        <td class="text-success">Supported, with <code>-ms</code> prefix</td>
      </tr>
      <tr>
        <th scope="row"><code>transition</code></th>
        <td class="text-danger">Not supported</td>
      </tr>
      <tr>
        <th scope="row"><code>placeholder</code></th>
        <td class="text-danger">Not supported</td>
      </tr>
    </tbody>
  </table>
</div>

Visit [Can I use...](http://caniuse.com/) for details on browser support of CSS3 and HTML5 features.

### Supporting Internet Explorer 8

As of v4, Bootstrap no longer supports IE8. **If you require IE8 support, we recommend you use Bootstrap 3.** It's still supported by our team for bugfixes and documentation changes, but no new features will be added to it.

Alternatively, you can add the some third party JavaScript to backfill support for the browser. You'll need the following:

* [The HTML5 shiv](http://en.wikipedia.org/wiki/HTML5_Shiv)
* [Respond.js](https://github.com/scottjehl/Respond)
* [Rem unit polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill)

### IE Compatibility modes

Bootstrap is not supported in the old Internet Explorer compatibility modes. To be sure you're using the latest rendering mode for IE, consider including the appropriate `<meta>` tag in your pages:

{% highlight html %}
<meta http-equiv="X-UA-Compatible" content="IE=edge">
{% endhighlight %}

Confirm the document mode by opening the debugging tools: press <kbd>F12</kbd> and check the "Document Mode".

This tag is included in all of Bootstrap's documentation and examples to ensure the best rendering possible in each supported version of Internet Explorer.

See [this StackOverflow question](http://stackoverflow.com/questions/6771258/whats-the-difference-if-meta-http-equiv-x-ua-compatible-content-ie-edge) for more information.

### Internet Explorer 10 in Windows 8 and Windows Phone 8

Internet Explorer 10 doesn't differentiate **device width** from **viewport width**, and thus doesn't properly apply the media queries in Bootstrap's CSS. Normally you'd just add a quick snippet of CSS to fix this:

{% highlight scss %}
@-ms-viewport { width: device-width; }
{% endhighlight %}

However, this doesn't work for devices running Windows Phone 8 versions older than [Update 3 (a.k.a. GDR3)](http://blogs.windows.com/windows_phone/b/wpdev/archive/2013/10/14/introducing-windows-phone-preview-for-developers.aspx), as it causes such devices to show a mostly desktop view instead of narrow "phone" view. To address this, you'll need to **include the following CSS and JavaScript to work around the bug**.

{% highlight scss %}
@-webkit-viewport   { width: device-width; }
@-moz-viewport      { width: device-width; }
@-ms-viewport       { width: device-width; }
@-o-viewport        { width: device-width; }
@viewport           { width: device-width; }
{% endhighlight %}

{% highlight js %}
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style')
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  )
  document.querySelector('head').appendChild(msViewportStyle)
}
{% endhighlight %}

For more information and usage guidelines, read [Windows Phone 8 and Device-Width](http://timkadlec.com/2013/01/windows-phone-8-and-device-width/).

As a heads up, we include this in all of Bootstrap's documentation and examples as a demonstration.

### Safari percent rounding

As of Safari v7.0.1 for OS X and Safari for iOS v7.0.1, Safari's rendering engine has some trouble with the number of decimal places used in our `.col-*-1` grid classes. So if you have 12 individual grid columns, you'll notice that they come up short compared to other rows of columns. We can't do much here ([see #9282](https://github.com/twbs/bootstrap/issues/9282)) but you do have some options:

- Add `.pull-right` to your last grid column to get the hard-right alignment
- Tweak your percentages manually to get the perfect rounding for Safari (more difficult than the first option)

We'll keep an eye on this though and update our code if we have an easy solution.

### Modals, navbars, and virtual keyboards

#### Overflow and scrolling

Support for `overflow: hidden;` on the `<body>` element is quite limited in iOS and Android. To that end, when you scroll past the top or bottom of a modal in either of those devices' browsers, the `<body>` content will begin to scroll.

#### Virtual keyboards

Also, note that if you're using a fixed navbar or using inputs within a modal, iOS has a rendering bug that doesn't update the position of fixed elements when the virtual keyboard is triggered. A few workarounds for this include transforming your elements to `position: absolute;` or invoking a timer on focus to try to correct the positioning manually. This is not handled by Bootstrap, so it is up to you to decide which solution is best for your application.

#### Navbar Dropdowns

The `.dropdown-backdrop` element isn't used on iOS in the nav because of the complexity of z-indexing. Thus, to close dropdowns in navbars, you must directly click the dropdown element (or any other element which will fire a click event in iOS).

### Browser zooming

Page zooming inevitably presents rendering artifacts in some components, both in Bootstrap and the rest of the web. Depending on the issue, we may be able to fix it (search first and then open an issue if need be). However, we tend to ignore these as they often have no direct solution other than hacky workarounds.

### Printer viewports

Even in some modern browsers, printing can be quirky. In particular, as of Chrome v32 and regardless of margin settings, Chrome uses a viewport width significantly narrower than the physical paper size when resolving media queries while printing a webpage. This can result in Bootstrap's extra-small grid being unexpectedly activated when printing. <a href="https://github.com/twbs/bootstrap/issues/12078">See #12078 for some details.</a> Suggested workarounds:

- Embrace the extra-small grid and make sure your page looks acceptable under it.
- Customize the values of the `@screen-*` Less variables so that your printer paper is considered larger than extra-small.
- Add custom media queries to change the grid size breakpoints for print media only.

### Android stock browser

Out of the box, Android 4.1 (and even some newer releases apparently) ship with the Browser app as the default web browser of choice (as opposed to Chrome). Unfortunately, the Browser app has lots of bugs and inconsistencies with CSS in general.

#### Select menu

On `<select>` elements, the Android stock browser will not display the side controls if there is a `border-radius` and/or `border` applied. (See [this StackOverflow question](http://stackoverflow.com/questions/14744437/html-select-box-not-showing-drop-down-arrow-on-android-version-4-0-when-set-with) for details.) Use the snippet of code below to remove the offending CSS and render the `<select>` as an unstyled element on the Android stock browser. The user agent sniffing avoids interference with Chrome, Safari, and Mozilla browsers.

{% highlight html %}
<script>
$(function () {
  var nua = navigator.userAgent
  var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
  if (isAndroid) {
    $('select.form-control').removeClass('form-control').css('width', '100%')
  }
})
</script>
{% endhighlight %}

Want to see an example? [Check out this JS Bin demo.](http://jsbin.com/OyaqoDO/2)
