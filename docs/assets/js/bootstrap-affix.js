/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!(function ($) {

  "use strict"; // jshint ;_;

  // Plugin uses only one listener on window scroll event, listen is also throttled to $.fn.affix.scrollThrottle ms.
  var $win = $(window)
    , watcher
    , didScroll = false

  // Will start listening to window scroll event, throttled to $.fn.affix.scrollThrottle ms.
  var startWatcher = function () {
    $win.on('scroll', function () {
      didScroll = true
    })

    watcher = setInterval(function () {
      if (didScroll) {
        didScroll = false
        $win.trigger('affix.scroll', [$win.scrollTop()])
      }
    }, $.fn.affix.scrollThrottle)
  }


 /* AFFIX CLASS DEFINITION
  * ====================== */

  function Affix( element, options) {
    var process = $.proxy(this.process, this)

    this.options = $.extend({}, $.fn.affix.defaults, options)

    // Start listening to window scrolls.
    if (!watcher) {
      startWatcher()
    }

    $win.on('affix.scroll', process);

    this.$element = $(element)
    this.height = this.$element.outerHeight(true)
    this.scrollTop = this.$element.length && this.$element.offset().top - this.options.offset
    this.isFixed = 0
    this.process(null, $win.scrollTop())
  }

  Affix.prototype = {

    constructor: Affix,

    process: function (e, winScrollTop) {
      if (winScrollTop >= this.scrollTop && !this.isFixed) {
        var off = this.$element.offset()
          , eleTop = off.top - this.scrollTop

        this.isFixed = 1
        // Fix the elements top, based on it's current position.
        this.$element.addClass(this.options.toggleclass).css({
          top: eleTop+"px"
        }).after("<div />").next().css("height", this.height+"px") // Will insert a div after the fixed element is detached to the exact height of the detachted element.
        // Fixed height div stops the page from jumping up when an element becomes deteched/affixed.
      } else if (winScrollTop <= this.scrollTop && this.isFixed) {
        this.isFixed = 0

        this.$element.removeClass(this.options.toggleclass).css({
          top: "auto" // Reset the top of the detached element, it's now docked.
        }).next().remove() // Remove the fixed height div, the deteched element is back now.
      }
    }
  }


 /* AFFIX PLUGIN DEFINITION
  * ====================== */

  $.fn.affix = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option

      if (!data) $this.data('affix', (data = new Affix(this, options)))
        if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0,
    toggleclass: "fixed"
  }

  $.fn.affix.scrollThrottle = 100


 /* AFFIX DATA-API
  * ============== */

  $(function () {
    $('[data-affix]').each(function () {
      var $a = $(this)
      $a.affix($a.data())
    })
  })

})(window.jQuery);
