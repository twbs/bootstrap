 /* EXTENDS BOOTSTRAP-TWIPSY.js
    =========================== */

(function( $ ) {

 /* POPOVER PUBLIC CLASS DEFINITION
  * ============================== */

  var Popover = function ( element, options ) {
    this.$element = $(element)
    this.options = options
    this.enabled = true
  }

  Popover.prototype = $.extend({}, $.fn.twipsy.Twipsy.prototype, {

    setContent: function () {
      var $tip = this.tip()
      $tip.find('.title')[this.options.html ? 'html' : 'text'](this.getTitle())
      $tip.find('.content p')[this.options.html ? 'html' : 'text'](this.getContent())
      $tip[0].className = 'popover'
    }

  , fixTitle: function () {}

  , getTitle: function () {
      var title
      if (typeof this.options.title == 'string') {
        title = this.$element.attr('data-title') || this.options.title
      } else if (typeof this.options.title == 'function') {
        title = this.options.title.call(this.$element[0])
      }
      return title
    }

  , getContent: function () {content
      var content
      if (typeof this.options.content == 'string') {
        content = this.$element.attr('data-content') || this.options.content
      } else if (typeof this.options.content == 'function') {
        content = this.options.content.call(this.$element[0])
      }
      return content
    }

  , tip: function() {
      if (!this.$tip) {
        this.$tip = $('<div class="popover" />')
          .html('<div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"><p></p></div></div>')
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (options) {
    if (typeof options == 'object') options = $.extend({}, $.fn.popover.defaults, options)
    $.fn.twipsy.initWith.call(this, options, Popover)
  }

  $.fn.popover.defaults = $.extend({}, $.fn.twipsy.defaults, { content: '', placement: 'right'})

})( jQuery || ender )