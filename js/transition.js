/* ========================================================================
 * Bootstrap: transition.js v3.1.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  function determineTotalTransitionTime($el) {
    var max = 0
    var duration = $el.css('transition-duration')
    var delay = $el.css('transition-delay')

    // for browsers that don't support transitions
    if (duration === undefined) return 0

    duration = duration.split(', ')
    delay = delay.split(', ')

    // determine which transition takes the longest
    for (var i = 0; i < duration.length; i++) {
      var total = parseFloat(duration[i]) + parseFloat(delay[i])
      max = max < total ? total : max
    }

    return max * 1000
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var $this = this
    var called = false
    duration = duration || determineTotalTransitionTime($this)

    $this.one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $this.trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return $this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
