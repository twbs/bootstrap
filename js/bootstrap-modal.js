/* =========================================================
 * bootstrap-modal.js v2.1.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
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
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.init(element,options)
  }

  Modal.prototype = {

      constructor: Modal
    , init: function(element, options) {
        var that = this
        this.options = options
        this.$element = $(element)
        this.$element.find('[data-dismiss="modal"]')
          .each(function(){
              if ( $(this).closest('.modal').is(that.$element) )
                $(this).on('click.dismiss.modal',$.proxy(that.hide,that))        
          })
        this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
      }

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show.modal')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          $(window).on("resize orientationchange", that,function() { that.setPosition() } )
          
          that.incZIndexCounter(that.$element)
          
          that.$element
            .show()
          that.setPosition()
          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
            .focus()

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown.modal') }) :
            that.$element.trigger('shown.modal')

        })
      }

    , hide: function (e) {
        e && e.preventDefault() && e.stopPropagation()

        var that = this

        e = $.Event('hide.modal')

        if (!this.isShown || e.isDefaultPrevented()) return

        $(window).off("resize orientationchange",that)
        
        this.$element.trigger(e)

        this.isShown = false

        if ($("div.modal.in").length <= 1) $('body').removeClass('modal-open')

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden.modal')

        this.decZIndexCounter(this.$element)
        this.backdrop()
      }

    , removeBackdrop: function () {
        this.decZIndexCounter(this.$backdrop);
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , setPosition: function () {
        var parent = this.$element.parent()
        var win = $(window)
        var windowWidth = win.width()
        var windowHeight = win.height()
        this.$element.appendTo("body").css({left:0,top:0,width:"auto",height:"auto"}) 
        var modalWidth = this.$element.outerWidth()
        var modalHeight = this.$element.outerHeight()
        
        
        this.$element
          .appendTo(parent)
          .offset({top: (modalHeight < windowHeight) ? win.scrollTop() + (windowHeight - modalHeight) / 2 : win.scrollTop(),left: (windowWidth - modalWidth)/2})            
          .css({"max-width":windowWidth})
          
    }
    
    , incZIndexCounter: function (elem) {
       $(elem).css({"z-index": ++ $.fn.modal.zindex_cnt})
    }
    
    , decZIndexCounter: function (elem) {
        var zindex = $(elem).css("z-index");
        if (zindex == $.fn.modal.zindex_cnt)
          $.fn.modal.zindex_cnt--
    }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .insertAfter(this.$element)

          this.incZIndexCounter(this.$backdrop);

          if (this.options.backdrop != 'static') {
            this.$backdrop.click($.proxy(this.hide, this))
          }

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal
  $.fn.modal.zindex_cnt = 2000

 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this)
        , href = $this.attr('href')
        , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option)
        .one('hide', function () {
          $this.focus()
        })
    })
  })

}(window.jQuery);