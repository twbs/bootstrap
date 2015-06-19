---
layout: page
title: Third party support
---

While we don't officially support any third party plugins or add-ons, we do offer some useful advice to help avoid potential issues in your projects.

## Box-sizing

Some third-party software, including Google Maps and Google Custom Search Engine, conflict with Bootstrap due to `* { box-sizing: border-box; }`, a rule which makes it so `padding` does not affect the final computed width of an element. These widgets expect the box model to be `content-box` instead. Learn more about [box model and sizing at CSS Tricks](https://css-tricks.com/box-sizing/).

You can deal with this conflict by overriding the box model back to `content-box` just for the third-party widget's section of the page:

{% highlight scss %}
/* Box-sizing reset
 *
 * Override an entire region's box model via CSS
 * to avoid conflicts due to the global box model settings of Bootstrap.
 */
.selector-for-some-widget {
  -webkit-box-sizing: content-box;
     -moz-box-sizing: content-box;
          box-sizing: content-box;
}
{% endhighlight %}
