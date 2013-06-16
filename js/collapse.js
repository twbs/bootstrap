/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
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
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var dimension = this.dimension()
    var scroll    = $.camelCase(['scroll', dimension].join('-'))
    var actives   = this.$parent && this.$parent.find('> .accordion-group > .in')

    if (actives && actives.length) {
      var hasData = actives.data('collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('collapse', null)
    }

    this.$element[dimension](0)
    this.transition('addClass', $.Event('show.bs.collapse'), 'shown.bs.collapse')

    if ($.support.transition) this.$element[dimension](this.$element[0][scroll])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return
    var dimension = this.dimension()
    this.reset(this.$element[dimension]())
    this.transition('removeClass', $.Event('hide.bs.collapse'), 'hidden')
    this.$element[dimension](0)
  }

  Collapse.prototype.reset = function (size) {
    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      [dimension](size || 'auto')
      [0].offsetWidth

    this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

    return this
  }

  Collapse.prototype.transition = function (method, startEvent, completeEvent) {
    var that     = this
    var complete = function () {
      if (startEvent.type == 'show') that.reset()
      that.transitioning = 0
      that.$element.trigger(completeEvent)
    }

    this.$element.trigger(startEvent)

    if (startEvent.isDefaultPrevented()) return

    this.transitioning = 1

    this.$element[method]('in')

    $.support.transition && this.$element.hasClass('collapse') ?
      this.$element.one($.support.transition.end, complete) :
      complete()
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this  = $(this), href
    var target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var option = $(target).data('collapse') ? 'toggle' : $this.data()

    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
