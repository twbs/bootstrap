/* ==========================================================
 * bootstrap-affix.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#affix
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


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('resize.affix.data-api', $.proxy(this.refresh, this))
    this.$element = $(element)
    this.refresh()
  }

  Affix.prototype.refresh = function () {
    this.position = this.$element.offset()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollLeft = this.$window.scrollLeft()
      , scrollTop = this.$window.scrollTop()
      , position = this.position
      , offset = this.options.offset
      , affix

    if (typeof offset != 'object') offset = { x: offset, y: offset }

    affix = (offset.x == null || (position.left - scrollLeft <= offset.x))
         && (offset.y == null || (position.top  - scrollTop  <= offset.y))

    if (affix == this.affixed) return

    this.affixed = affix

    this.$element[affix ? 'addClass' : 'removeClass']('affix')
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
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
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetX && (data.offset.x = data.offsetX)
      data.offsetY && (data.offset.y = data.offsetY)

      $spy.affix(data)
    })
  })


}(window.jQuery);