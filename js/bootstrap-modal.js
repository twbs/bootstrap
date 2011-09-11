/* =========================================================
 * bootstrap-modal.js
 * http://twitter.github.com/bootstrap/javascript.html#modal
 * =========================================================
 * Copyright 2011 Twitter, Inc.
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
 * ========================================================= */


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

      _.backdrop.call(this, function () {
        that.$element
          .appendTo(document.body)
          .show()

        setTimeout(function () {
          that.$element
            .addClass('in')
            .trigger('modal:shown')
        }, 1)
      })

      return this
    }

  , hide: function (e) {
      e && e.preventDefault()

      var that = this

      this.isShown = false

      _.escape.call(this)

      this.$element.removeClass('in')

      function removeElement () {
        that.$element
          .detach()
          .trigger('modal:hidden')

        _.backdrop.call(that)
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

    backdrop: function ( callback ) {
      var that = this
        , animate = this.$element.hasClass('fade') ? 'fade' : ''
      if ( this.isShown && this.settings.backdrop ) {
        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
          .click($.proxy(this.hide, this))
          .appendTo(document.body)

        setTimeout(function () {
          that.$backdrop && that.$backdrop.addClass('in')
          $.support.transition && that.$backdrop.hasClass('fade') ?
            that.$backdrop.one(transitionEnd, callback) :
            callback()
        })
      } else if ( !this.isShown && this.$backdrop ) {
        this.$backdrop.removeClass('in')

        function removeElement() {
          that.$backdrop.remove()
          that.$backdrop = null
        }

        $.support.transition && this.$element.hasClass('fade')?
          this.$backdrop.one(transitionEnd, removeElement) :
          removeElement()
      } else {
        callback()
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