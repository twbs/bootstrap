/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
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


+function ($) { 'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null
    this.modalParent = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      if (that.findModalParent()) {
        // put parentModal behind the backdrop
        that.modalParent.$element.css('z-index', 0)

        that.modalParent.$element.off('keyup.dismiss.bs.modal')
        $(document).off('focusin.bs.modal')

        that.modalParent.$element.on('hidden.bs.modal.submodal', function(e) {
          if (e.target === that.modalParent.$element[0]) {
            that.modalParent = null
          }
        })
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    var that = this
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', function (e) {
        if (that.$element[0] !== e.target && !$.contains(that.$element[0], e.target)) {
          that.$element.focus()
        }
      })
  }

  Modal.prototype.escape = function () {
    var that = this
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      if (that.modalParent) {
        that.modalParent.$element.css('z-index', '')
        that.modalParent.$element.off('hidden.bs.modal.submodal')
        that.modalParent.escape()
        that.modalParent.enforceFocus()
        that.modalParent.$element.focus()
        that.modalParent = null
      }

      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
    $(document.body).removeClass('modal-open')
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''
    var count   = 0;

    if (this.isShown && this.options.backdrop) {
      var $inBackdrops = $('.modal-backdrop.in');
      if ($inBackdrops.length) {
        //skip adding new backdrop, reuse the existing
        this.$backdrop = $inBackdrops.first()
        count = this.$backdrop.data('bs.modal.refcount') || 0
        this.$backdrop.data('bs.modal.refcount', ++count)

        callback && callback()
        return
      }

      var doAnimate = $.support.transition && animate

      $(document.body).addClass('modal-open')

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      count = this.$backdrop.data('bs.modal.refcount')
      if (count) {
        this.$backdrop.data('bs.modal.refcount', --count)
        callback && callback()
        return
      }

      this.$backdrop.removeClass('in')

      if ($.support.transition && this.$element.hasClass('fade')) {
        this.$backdrop
          .one($.support.transition.end, function() {
            that.removeBackdrop()
            callback && callback()
          })
          .emulateTransitionEnd(150)
      } else {
        this.removeBackdrop()
        callback && callback()
      }

    } else if (callback) {
      callback()
    }
  }

  /**
   * Try to find the modal dialog, that was shown before this one.
   * updates the this.modalParent property.
   *
   * @return {boolean}
   *         false: if it has no parent
   *         true:  parent was found
   */
  Modal.prototype.findModalParent = function() {
    var that = this
    $('.modal.in').each(function() {
      var $elem = $(this)
      var data = $elem.data('bs.modal')
      if (data && data.isShown) {
        if (!that.modalParent || $elem.css('z-index') > that.modalParent.$element.css('z-index')) {
          that.modalParent = data
        }
      }
    })
    return this.modalParent ? true : false
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

}(jQuery);
