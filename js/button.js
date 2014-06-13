/* ========================================================================
 * Bootstrap: button.js v3.1.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
      this.$element  = $(element)
      this.options   = $.extend({}, Button.DEFAULTS, options)
      this.isLoading = false
    }

    Button.VERSION  = '3.1.1'

    Button.DEFAULTS = {
      loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
      var d    = 'disabled'
      var $el  = this.$element
      var val  = $el.is('input') ? 'val' : 'html'
      var data = $el.data()

      state = state + 'Text'

      if (data.resetText == null) $el.data('resetText', $el[val]())

      $el[val](data[state] == null ? this.options[state] : data[state])

      // push to event loop to allow forms to submit
      setTimeout($.proxy(function () {
        if (state == 'loadingText') {
          this.isLoading = true
          $el.addClass(d).attr(d, d)
        } else if (this.isLoading) {
          this.isLoading = false
          $el.removeClass(d).removeAttr(d)
        }
      }, this), 0)
    }

    Button.prototype.toggle = function () {
      var changed = true
      var $parent = this.$element.closest('[data-toggle="buttons"]')

      if ($parent.length) {
        var $input = this.$element.find('input')
        if ($input.prop('type') == 'radio') {
          if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
          else $parent.find('.active').removeClass('active')
        }
        if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
      }

      if (changed) this.$element.toggleClass('active')
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.button')
        var options = typeof option == 'object' && option

        if (!data) $this.data('bs.button', (data = new Button(this, options)))

        if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
      })
    }

    var old = $.fn.button

    $.fn.button             = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
      $.fn.button = old
      return this
    }


    // BUTTON DATA-API
    // ===============

    $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })

  })

}();
