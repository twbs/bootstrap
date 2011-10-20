/* =========================================================
 * bootstrap-modal.js v2.0.0
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


!function( $ ){

 /* MODAL PUBLIC CLASS DEFINITION
  * ============================= */

  var Modal = function ( content, options ) {
    this.settings = $.extend({}, $.fn.modal.defaults, options)
    this.$element = $(content)
      .delegate('[data-modal-dismiss]', 'click', $.proxy(this.hide, this))

    if ( this.settings.show ) {
      this.show()
    }

    return this
  }

  Modal.prototype = {

      toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
        this.isShown = true
        this.$element.trigger('show')

        escape.call(this)
        backdrop.call(this)

        return this
      }

    , hide: function (e) {
        e && e.preventDefault()

        if ( !this.isShown ) {
          return this
        }

        var that = this
        this.isShown = false

        escape.call(this)

        this.$element
          .trigger('hide')
          .removeClass('in')

        function removeElement () {
          that.$element
            .hide()
            .trigger('hidden')

          backdrop.call(that)
        }

        $.support.transition && this.$element.hasClass('fade') ?
          this.$element.one($.support.transition.end, removeElement) :
          removeElement()

        return this
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function backdrop () {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''
      , callback = $.proxy(show, this)

    if ( this.isShown && this.settings.backdrop ) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if ( this.settings.backdrop != 'static' ) {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if ( doAnimate ) {
        this.$backdrop[0].offsetWidth // force reflow
      }

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if ( !this.isShown && this.$backdrop ) {
      this.$backdrop.removeClass('in')

      function removeElement() {
        that.$backdrop.remove()
        that.$backdrop = null
      }

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, removeElement) :
        removeElement()
    } else if ( callback ) {
       callback()
    }
  }

  function show() {
    var transition = $.support.transition && that.$element.hasClass('fade')
      , that = this

    this.$element
      .appendTo(document.body)
      .show()

    if (transition) {
      this.$element[0].offsetWidth // force reflow
    }

    this.$element
      .addClass('in')

    transition ?
      this.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
      this.$element.trigger('shown')
  }

  function escape() {
    var that = this
    if ( this.isShown && this.settings.keyboard ) {
      $(document).bind('keyup.modal', function ( e ) {
        if ( e.which == 27 ) {
          that.hide()
        }
      })
    } else if ( !this.isShown ) {
      $(document).unbind('keyup.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function ( options ) {
    var modal = this.data('modal')

    if (!modal) {

      if (typeof options == 'string') {
        options = {
          show: /show|toggle/.test(options)
        }
      }

      return this.each(function () {
        $(this).data('modal', new Modal(this, options))
      })
    }

    if ( options === true ) {
      return modal
    }

    if ( typeof options == 'string' ) {
      modal[options]()
    } else if ( modal ) {
      modal.toggle()
    }

    return this
  }

  $.fn.modal.Modal = Modal

  $.fn.modal.defaults = {
    backdrop: false
  , keyboard: false
  , show: false
  }


 /* MODAL DATA-IMPLEMENTATION
  * ========================= */

  $(function () {
    $('body').delegate('[data-controls-modal]', 'click', function (e) {
      e.preventDefault()
      var $this = $(this).data('show', true)
      $('#' + $this.attr('data-controls-modal')).modal( $this.data() )
    })
  })

}( window.jQuery || window.ender );