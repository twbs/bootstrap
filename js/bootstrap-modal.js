/* =========================================================
 * bootstrap-modal.js v2.0.4
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
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          that.saveLocation(that.$element)

          // need to stack the modals so that if there are multiple ones are 
          // on a page, they appear on top of each other
          $(document.body).children().eq(0).hasClass('modal') ?
            that.$element.detach().insertAfter('.modal') :
            that.$element.detach().prependTo(document.body)

          // position in center of window          
          that.$element.css('margin-left', -(that.$element.width() / 2))
            
          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .css('top', '-25%')
            .addClass('in')
            .attr('aria-hidden', false)
            .focus()

          that.setPosition(that.$element)
          
          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

          $(window).on('resize.modal', function() { that.setPosition(that.$element) })
        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open, modal-open-noscroll')

        this.escape()

        $(document).off('focusin.modal')
        $(window).off('resize.modal')

        this.$element
          .css('top', 0)
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
          .trigger('hidden')

        this.restoreLocation(this.$element.detach())

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .prependTo(document.body)

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
      
    , saveLocation: function(elem) {
        var loc = {}, item = $(elem).prev()
        loc.element = elem
        loc.scrollTop = this.getScrollTop()
        item.length ?
          loc.prev = item[0] :
          loc.parent = elem.parent()[0]
        elem.data('modal-location', loc)        
      }
    
    , restoreLocation: function (elem) {
        var loc = elem.data('modal-location')
        $(document.body).scrollTop(loc.scrollTop)
        loc.parent ?
          $(loc.parent).prepend(loc.element) :
          $(loc.prev).after(loc.element)
      }

    , setPosition: function (elem) {
        var that = this, b = $(document.body), t = elem.attr('data-top'), 
          top = elem.css('top')
        if (t) {
          t = that.getScrollTop() + parseInt(t, 10)
        } else if (elem.css('top') != '-25%' && parseInt(top, 10) < 15) {
          b.removeClass('modal-open-noscroll')
          t = that.getScrollTop() + 15
        } else {
          b.addClass('modal-open-noscroll')
          t = that.getScrollTop() + ($(window).height() / 2) - (elem.height() / 2)
        }
        elem.css('top', t)
      }

    , getScrollTop: function () {
        if (typeof window.pageYOffset != 'undefined') {
          return window.pageYOffset // most browsers
        } else {
          var b = document.body, d = document.documentElement
          d = d.clientHeight ? d : b
          return d.scrollTop
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