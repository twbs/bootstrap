(function( $ ){

 /* CSS TRANSITION SUPPORT (https://gist.github.com/373874)
  * ======================================================= */

  var transitionEnd

  $(function () {

    $.support.transition = (function () {
      var thisBody = document.body || document.documentElement
        , thisStyle = thisBody.style
        , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
      return support
    })()

    // set CSS transition event type
    if ( $.support.transition ) {
      transitionEnd = "TransitionEnd"
      if ( $.browser.webkit ) {
      	transitionEnd = "webkitTransitionEnd"
      } else if ( $.browser.mozilla ) {
      	transitionEnd = "transitionend"
      } else if ( $.browser.opera ) {
      	transitionEnd = "oTransitionEnd"
      }
    }

  })


 /* MODAL PUBLIC CLASS DEFINITION
  * ============================= */

  var Modal = function ( content, options ) {
    this.settings = $.extend({}, $.fn.modal.defaults)

    if ( options ) {
      $.extend( this.settings, options )
    }

    this.$element = $(content)
      .bind('modal:open', $.proxy(this.open, this))
      .bind('modal:close', $.proxy(this.close, this))
      .bind('modal:toggle', $.proxy(this.toggle, this))
      .delegate('.close', 'click', $.proxy(this.close, this))

    return this
  }

  Modal.prototype = {

    toggle: function () {
      return this[!this.isOpen ? 'open' : 'close']()
    }

  , open: function () {
      var that = this
      this.isOpen = true

      _.escape.call(this)
      _.backdrop.call(this)

      this.$element
        .appendTo(document.body)
        .show()

      setTimeout(function () {
        that.$element.addClass('in')
        that.$backdrop && that.$backdrop.addClass('in')
      }, 1)

      return this
    }

  , close: function (e) {
      e && e.preventDefault()

      var that = this

      this.isOpen = false

      _.escape.call(this)
      _.backdrop.call(this)

      this.$element.removeClass('in')

      function removeElement () {
        that.$element.unbind(transitionEnd)
        that.$element.detach()
      }

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element.bind(transitionEnd, removeElement) :
        removeElement()

      return this
    }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  var _ = {

    backdrop: function () {
      var that = this
        , animate = this.$element.hasClass('fade') ? 'fade' : ''
      if ( this.isOpen && this.settings.backdrop ) {
        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
          .click(function () { that.close() })
          .appendTo(document.body)
      } else if ( !this.isOpen && this.$backdrop ) {
        this.$backdrop.removeClass('in')

        function removeElement() {
          that.$backdrop.remove()
          that.$backdrop = null
        }

        $.support.transition && this.$element.hasClass('fade')?
          this.$backdrop.bind(transitionEnd, removeElement) :
          removeElement()
      }
    }

  , escape: function () {
      var that = this
      if ( this.isOpen && this.settings.closeOnEscape ) {
        $('body').bind('keyup.modal.escape', function ( e ) {
          if ( e.which == 27 ) {
            that.close()
          }
        })
      } else if ( !this.isOpen ) {
        $('body').unbind('keyup.modal.escape')
      }
    }

  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function ( options ) {
    options = options || {}
    return this.each(function () {
      return new Modal(this, options)
    })
  }

  $.fn.modal.Modal = Modal

  $.fn.modal.defaults = {
    backdrop: false
  , closeOnEscape: false
  }

})( jQuery || ender )