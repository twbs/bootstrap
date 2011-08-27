(function( $ ){

  /* CSS TRANSITION SUPPORT (https://gist.github.com/373874)
   * ======================================================= */

  $.support.transition = (function(){
    var thisBody = document.body || document.documentElement
      , thisStyle = thisBody.style
      , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
    return support;
  })();


 /* SHARED VARS
  * =========== */

  var $window = $(window)
    , transitionEnd

  // set CSS transition event type
  if ($.support.transition) {
    transitionEnd = "TransitionEnd"
    if ($.browser.webkit) {
    	transitionEnd = "webkitTransitionEnd"
    } else if ($.browser.mozilla) {
    	transitionEnd = "transitionend"
    } else if ($.browser.opera) {
    	transitionEnd = "oTransitionEnd"
    }
  }


 /* MODAL PUBLIC CLASS DEFINITION
  * ============================= */

  var Modal = function (options) {
    this.settings = {
      backdrop: false
    , closeOnEscape: false
    , content: false
    }

    if ( typeof options == 'string' ) {
      this.settings.content = options
    } else if ( options ) {
      $.extend( this.settings, options )
    }

    return this
  }

  Modal.prototype = {

    toggle: function () {
      return this[!this.isOpen ? 'open' : 'close']()
    }

  , open: function () {
      var that = this
      this.isOpen = true

      _private.onEscape.call(this)
      _private.backdrop.call(this)

      this.$element = $(this.settings.content)
        .delegate('.close', 'click', function (e) { e.preventDefault(); that.close() })
        .appendTo(document.body)

      setTimeout(function () {
        that.$element.addClass('open')
        that.$backdrop && that.$backdrop.addClass('open')
      }, 1)

      return this
    }

  , close: function () {
      var that = this

      this.isOpen = false

      _private.onEscape.call(this)
      _private.backdrop.call(this)

      this.$element.removeClass('open')

      function removeElement () {
        that.$element.remove()
        that.$element = null
      }

      $.support.transition ?
        this.$element.bind(transitionEnd, removeElement) :
        removeElement()

      return this
    }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  var _private = {

    backdrop: function () {
      var that = this
      if (this.isOpen && this.settings.backdrop) {
        this.$backdrop = $('<div class="modal-backdrop" />')
          .click(function () { that.close() })
          .appendTo(document.body)
      } else if (!this.isOpen && this.$backdrop){
        this.$backdrop.removeClass('open')

        function removeElement() {
          that.$backdrop.remove()
          that.$backdrop = null
        }

        $.support.transition ?
          this.$backdrop.bind(transitionEnd, removeElement) :
          removeElement()
      }
    }

  , onEscape: function () {
      var that = this
      if (this.isOpen && this.settings.closeOnEscape) {
        $window.bind('keyup.modal.escape', function (e) {
          if ( e.which == 27 ) {
            that.close()
          }
        })
      } else if (!this.isOpen) {
        $window.unbind('keyup.modal.escape')
      }
    }

  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.modal = function (options) {
    return new Modal(options)
  }

  $.fn.modal = function (options) {
    options = options || {}
    options.content = this
    return new Modal(options)
  }

})( jQuery || ender )