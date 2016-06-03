---
layout: docs
title: Browsers and devices
group: getting-started
---

Bootstrap supports a wide variety of modern browsers and devices, and some older ones. See which exact ones below, as well as detailed information on known quirks and bugs.

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Supported browsers

Bootstrap supports the **latest, stable releases** of all major browsers and platforms. On Windows, **we support Internet Explorer 9-11 / Microsoft Edge**.

Alternative browsers which use the latest version of WebKit, Blink, or Gecko, whether directly or via the platform's web view API, are not explicitly supported. However, Bootstrap should (in most cases) display and function correctly in these browsers as well. More specific support information is provided below.

### Mobile devices

Generally speaking, Bootstrap supports the latest versions of each major platform's default browsers. Note that proxy browsers (such as Opera Mini, Opera Mobile's Turbo mode, UC Browser Mini, Amazon Silk) are not supported.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <td></td>
        <th>Chrome</th>
        <th>Firefox</th>
        <th>Safari</th>
        <th>Android Browser &amp; WebView</th>
        <th>Microsoft Edge</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Android</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-muted">N/A</td>
        <td class="text-success">Android v5.0+ supported</td>
        <td class="text-muted">N/A</td>
      </tr>
      <tr>
        <th scope="row">iOS</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-muted">N/A</td>
        <td class="text-muted">N/A</td>
      </tr>
      <tr>
        <th scope="row">Windows 10 Mobile</th>
        <td class="text-muted">N/A</td>
        <td class="text-muted">N/A</td>
        <td class="text-muted">N/A</td>
        <td class="text-muted">N/A</td>
        <td class="text-success">Supported</td>
      </tr>
    </tbody>
  </table>
</div>

### Desktop browsers

Similarly, the latest versions of most desktop browsers are supported.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <td></td>
        <th>Chrome</th>
        <th>Firefox</th>
        <th>Internet Explorer</th>
        <th>Microsoft Edge</th>
        <th>Opera</th>
        <th>Safari</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Mac</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-muted">N/A</td>
        <td class="text-muted">N/A</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th scope="row">Windows</th>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-success">Supported</td>
        <td class="text-danger">Not supported</td>
      </tr>
    </tbody>
  </table>
</div>

For Firefox, in addition to the latest normal stable release, we also support the latest [Extended Support Release (ESR)](https://www.mozilla.org/en-US/firefox/organizations/faq/) version of Firefox.

Unofficially, Bootstrap should look and behave well enough in Chromium and Chrome for Linux, Firefox for Linux, and Internet Explorer 8 and below, though they are not officially supported.

For a list of some of the browser bugs that Bootstrap has to grapple with, see our [Wall of browser bugs]({{ site.baseurl }}/browser-bugs/).

## Internet Explorer 9 & 10

Internet Explorer 9 & 10 are also supported, however, please be aware that some CSS3 properties and HTML5 elements are not fully supported.

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th scope="col">Feature</th>
        <th scope="col">Internet Explorer 9</th>
        <th scope="col">Internet Explorer 10</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row"><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transition"><code>transition</code></a></th>
        <td class="text-danger">Not supported</td>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th scope="row"><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-placeholder"><code>placeholder</code></a></th>
        <td class="text-danger">Not supported</td>
        <td class="text-success">Supported</td>
      </tr>
      <tr>
        <th scope="row"><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes">Flexbox</a></th>
        <td class="text-danger">Not supported</td>
        <td class="text-warning">Partially supported, with <code>-ms</code> prefix<br><a href="http://caniuse.com/#feat=flexbox">See <em>Can I use</em> for details</a></td>
      </tr>
    </tbody>
  </table>
</div>

Visit [Can I use...](http://caniuse.com/) for details on browser support of CSS3 and HTML5 features.

## Supporting Internet Explorer 8

As of v4, Bootstrap no longer supports IE8. **If you require IE8 support, we recommend you use Bootstrap 3.** It's still supported by our team for bugfixes and documentation changes, but no new features will be added to it.

Alternatively, you may add some third party JavaScript to backfill support for IE8 to Bootstrap 4. You'll need the following:

* [The HTML5 shiv](https://en.wikipedia.org/wiki/HTML5_Shiv)
* [Respond.js](https://github.com/scottjehl/Respond)
* [Rem unit polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill)

No support will be provided for this, though you may find some help from the community in [our Slack channel]({{ site.slack }}).

## IE Compatibility modes

Bootstrap is not supported in the old Internet Explorer compatibility modes. To be sure you're using the latest rendering mode for IE, consider including the appropriate `<meta>` tag in your pages:

{% highlight html %}
<meta http-equiv="X-UA-Compatible" content="IE=edge">
{% endhighlight %}

Confirm the document mode by opening the debugging tools: press <kbd>F12</kbd> and check the "Document Mode".

This tag is included in all of Bootstrap's documentation and examples to ensure the best rendering possible in each supported version of Internet Explorer.

See [this StackOverflow question](https://stackoverflow.com/questions/6771258/whats-the-difference-if-meta-http-equiv-x-ua-compatible-content-ie-edge) for more information.

## Internet Explorer 10 in Windows Phone 8

Internet Explorer 10 in Windows Phone 8 versions older than [Update 3 (a.k.a. GDR3)](http://blogs.windows.com/windows_phone/b/wpdev/archive/2013/10/14/introducing-windows-phone-preview-for-developers.aspx) doesn't differentiate **device width** from **viewport width** in `@-ms-viewport` at-rules, and thus doesn't properly apply the media queries in Bootstrap's CSS. To address this, you'll need to **include the following JavaScript to work around the bug**.

{% highlight js %}
// Copyright 2014-2015 The Bootstrap Authors
// Copyright 2014-2015 Twitter, Inc.
// Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style')
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  )
  document.head.appendChild(msViewportStyle)
}
{% endhighlight %}

For more information and usage guidelines, read [Windows Phone 8 and Device-Width](http://timkadlec.com/2013/01/windows-phone-8-and-device-width/).

As a heads up, we include this in all of Bootstrap's documentation and examples as a demonstration.

## Modals and dropdowns on mobile

### Overflow and scrolling

Support for `overflow: hidden;` on the `<body>` element is quite limited in iOS and Android. To that end, when you scroll past the top or bottom of a modal in either of those devices' browsers, the `<body>` content will begin to scroll. See [Chrome bug #175502](https://bugs.chromium.org/p/chromium/issues/detail?id=175502) (fixed in Chrome v40) and [WebKit bug #153852](https://bugs.webkit.org/show_bug.cgi?id=153852).

### iOS text fields and scrolling

As of iOS 9.2, while a modal is open, if the initial touch of a scroll gesture is within the boundary of a textual `<input>` or a `<textarea>`, the `<body>` content underneath the modal will be scrolled instead of the modal itself. See [WebKit bug #153856](https://bugs.webkit.org/show_bug.cgi?id=153856).

### Navbar Dropdowns

The `.dropdown-backdrop` element isn't used on iOS in the nav because of the complexity of z-indexing. Thus, to close dropdowns in navbars, you must directly click the dropdown element (or [any other element which will fire a click event in iOS](https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile)).

## Browser zooming

Page zooming inevitably presents rendering artifacts in some components, both in Bootstrap and the rest of the web. Depending on the issue, we may be able to fix it (search first and then open an issue if need be). However, we tend to ignore these as they often have no direct solution other than hacky workarounds.

## Sticky `:hover`/`:focus` on mobile
Even though real hovering isn't possible on most touchscreens, most mobile browsers emulate hovering support and make `:hover` "sticky". In other words, `:hover` styles start applying after tapping an element and only stop applying after the user taps some other element. On mobile-first sites, this behavior is normally undesirable.

Bootstrap includes a workaround for this, although it is disabled by default. By setting `$enable-hover-media-query` to `true` when compiling from Sass, Bootstrap will use [mq4-hover-shim](https://github.com/twbs/mq4-hover-shim) to disable `:hover` styles in browsers that emulate hovering, thus preventing sticky `:hover` styles. There are some caveats to this workaround; see the shim's documentation for details.

## Printing

Even in some modern browsers, printing can be quirky.

In particular, as of Chrome v32 and regardless of margin settings, Chrome uses a viewport width significantly narrower than the physical paper size when resolving media queries while printing a webpage. This can result in Bootstrap's extra-small grid being unexpectedly activated when printing. See [issue #12078](https://github.com/twbs/bootstrap/issues/12078) and [Chrome bug #273306](https://bugs.chromium.org/p/chromium/issues/detail?id=273306) for some details. Suggested workarounds:

* Embrace the extra-small grid and make sure your page looks acceptable under it.
* Customize the value of the `$grid-breakpoints` Sass variable so that your printer paper is considered larger than extra-small.
* Add custom media queries to change the grid size breakpoints for print media only.

Also, as of Safari v8.0, use of the fixed-width `.container` class can cause Safari to use an unusually small font size when printing. See [issue #14868](https://github.com/twbs/bootstrap/issues/14868) and [WebKit bug #138192](https://bugs.webkit.org/show_bug.cgi?id=138192) for more details. One potential workaround is the following CSS:

{% highlight css %}
@media print {
  .container {
    width: auto;
  }
}
{% endhighlight %}

## Android stock browser

Out of the box, Android 4.1 (and even some newer releases apparently) ship with the Browser app as the default web browser of choice (as opposed to Chrome). Unfortunately, the Browser app has lots of bugs and inconsistencies with CSS in general.

#### Select menu

On `<select>` elements, the Android stock browser will not display the side controls if there is a `border-radius` and/or `border` applied. (See [this StackOverflow question](https://stackoverflow.com/questions/14744437/html-select-box-not-showing-drop-down-arrow-on-android-version-4-0-when-set-with) for details.) Use the snippet of code below to remove the offending CSS and render the `<select>` as an unstyled element on the Android stock browser. The user agent sniffing avoids interference with Chrome, Safari, and Mozilla browsers.

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

## Validators

In order to provide the best possible experience to old and buggy browsers, Bootstrap uses [CSS browser hacks](http://browserhacks.com) in several places to target special CSS to certain browser versions in order to work around bugs in the browsers themselves. These hacks understandably cause CSS validators to complain that they are invalid. In a couple places, we also use bleeding-edge CSS features that aren't yet fully standardized, but these are used purely for progressive enhancement.

These validation warnings don't matter in practice since the non-hacky portion of our CSS does fully validate and the hacky portions don't interfere with the proper functioning of the non-hacky portion, hence why we deliberately ignore these particular warnings.

Our HTML docs likewise have some trivial and inconsequential HTML validation warnings due to our inclusion of a workaround for [a certain Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=654072).
