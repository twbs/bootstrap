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
      .bind('modal:show', $.proxy(this.show, this))
      .bind('modal:hide', $.proxy(this.hide, this))
      .bind('modal:toggle', $.proxy(this.toggle, this))
      .delegate('.close', 'click', $.proxy(this.hide, this))

    return this
  }

  Modal.prototype = {

    toggle: function () {
      return this[!this.isShown ? 'show' : 'hide']()
    }

  , show: function () {
      var that = this
      this.isShown = true

      _.escape.call(this)
      _.backdrop.call(this)

      this.$element
        .appendTo(document.body)
        .show()

      setTimeout(function () {
        that.$element.addClass('in').trigger('modal:shown')
        that.$backdrop && that.$backdrop.addClass('in')
      }, 1)

      return this
    }

  , hide: function (e) {
      e && e.preventDefault()

      var that = this

      this.isShown = false

      _.escape.call(this)
      _.backdrop.call(this)

      this.$element.removeClass('in')

      function removeElement () {
        that.$element
          .detach()
          .trigger('modal:hidden')
      }

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element.one(transitionEnd, removeElement) :
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
      if ( this.isShown && this.settings.backdrop ) {
        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
          .click($.proxy(this.hide, this))
          .appendTo(document.body)
      } else if ( !this.isShown && this.$backdrop ) {
        this.$backdrop.removeClass('in')

        function removeElement() {
          that.$backdrop.remove()
          that.$backdrop = null
        }

        $.support.transition && this.$element.hasClass('fade')?
          this.$backdrop.one(transitionEnd, removeElement) :
          removeElement()
      }
    }

  , escape: function () {
      var that = this
      if ( this.isShown && this.settings.closeOnEscape ) {
        $('body').bind('keyup.modal.escape', function ( e ) {
          if ( e.which == 27 ) {
            that.hide()
          }
        })
      } else if ( !this.isShown ) {
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
  , hideOnEscape: false
  }

})( jQuery || ender )