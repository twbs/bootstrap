/* ========================================================================
 * Bootstrap: touch-detection.js v3.1.1
 * http://getbootstrap.com/
 * ========================================================================
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/*! Credit: Modernizr v3.0.0-alpha.0 | MIT */


+function ($) {
  'use strict';

  $(function () {
    // Based on: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
    // and http://www.w3.org/TR/pointerevents/#examples

    var testDiv, isTouch = ('ontouchstart' in window) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0)
    if (!isTouch) {
      testDiv = $('<div class="bs-touch-test"></div>').appendTo(document.body)
      isTouch = testDiv.css('top') == '-99px'
      testDiv.remove()
    }
    if (!isTouch) {
      (document.documentElement.className += ' bs-no-touch')
    }
  })
}(jQuery);
