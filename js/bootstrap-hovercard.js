/* ===========================================================
 * hovercard.js
 * Modification of bootstrap-popover.js
 * ===========================================================
 * Copyright 2011 Focus.com, Inc.
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
 * =========================================================== */

!function( $ ) {
  var twipsyData = 'twipsy'
    , headerBuffer = 0

  if ($('.topbar').length > 0) {
    headerBuffer = $('.topbar').height()
  }

  var findPlacement = function(popup, ele) {
    // check if the element is on the top half or bottom half of the window
    if ($(ele).offset().top <
        (($(window).height() - headerBuffer) / 2) + $(window).scrollTop()) {
      // popup will default on the right side, so
      // check if the popup will overflow out the right side
      if (end_x > $(window).scrollLeft() + $(window).width()) {
        return 'bottomleft below'
      }
      else {
        return 'bottomright below'
      }
    }
    else {
      // popup will default on the right side, so
      // check if the popup will overflow out the right side
      if (end_x > $(window).scrollLeft() + $(window).width()) {
        return 'topleft above'
      }

      else {
        return 'topright above'
      }
    }
  }

  var Hovercard = function ( element, options ) {
    this.$element = $(element)
    this.options = options
    this.enabled = true
    this.fixTitle()
  }

  /* NOTE: HOVERCARD EXTENDS BOOTSTRAP-TWIPSY.js
     ========================================= */

  Hovercard.prototype = $.extend({}, $.fn.twipsy.Twipsy.prototype, {

    show: function() {
      var arrowLoc

      $.fn.twipsy.Twipsy.prototype.show.call(this)

      // TODO: clean this up so we don't have to do a DOM lookup
      if (this.tip().hasClass('topleft') || this.tip().hasClass('bottomleft')) {
        arrowLoc = this.tip()[0].offsetWidth - this.$element[0].offsetWidth / 2
      }
      else {
        arrowLoc = this.$element[0].offsetWidth / 2
      }

      this.tip()
        .find('.arrow')
        .css({
          left: arrowLoc
        })
    }

  , setContent: function () {
      var $tip = this.tip()
      $tip.find('.title')[this.options.html ? 'html' : 'text'](this.getTitle())
      $tip.find('.content p')[this.options.html ? 'html' : 'text'](this.getContent())
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      if (typeof this.options.content == 'string') {
        content = $e.attr(o.content)
      } else if (typeof this.options.content == 'function') {
        content = this.options.content.call(this.$element[0])
      }
      return content;
    }

  , tip: function() {
      if (!this.$tip) {
        this.$tip = $('<div class="popover" />')
          .html('<div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"><p></p></div></div>')
      }
      return this.$tip
    }

  , getPlacement: function(placement, dim) {
      var tp

      switch (placement) {
        case 'topleft above':
          tp = {
            top: dim.ele.top - dim.popup.height
          , left: dim.ele.left + dim.ele.width - dim.popup.width
          }
          break
        case 'topright above':
          tp = {
            top: dim.ele.top - dim.popup.height
          , left: dim.ele.left
          }
          break
        case 'bottomleft below':
          tp = {
            top: dim.ele.top + dim.ele.height
          , left: dim.ele.left + dim.ele.width - dim.popup.width
          }
          break
        case 'bottomright below':
          tp = {
            top: dim.ele.top + dim.ele.height
          , left: dim.ele.left
          }
          break
      }

      return tp

  }

  /**
   * Displays the hovercard if the popup isn't already active.
   * Also cancels any timers with hiding the hovercard if there is a delayOut.
   */
  , enter: function() {
      var enterTimer
        , that = this

      if (this.tip()) {
        clearTimeout(this.tip().data('leaveTimer'))

        if (!this.tip().hasClass('in')) {
          if (this.options.delayIn === 0) {
            this.show()
            this.tip().data(twipsyData, this)
          }
          else {
            this.fixTitle()
            enterTimer = setTimeout(function() {
              that.show()
              that.tip().data(twipsyData, that)
            }, this.options.delayIn)
            this.tip().data('enterTimer', enterTimer)
          }
        }
      }
    }

  , leave: function() {
      var leaveTimer
        , that = this

      if (this.tip()) {
        clearTimeout(this.tip().data('enterTimer'))
      }

      if (this.options.delayOut === 0) {
        this.hide()
      }
      else {
        leaveTimer = setTimeout(function() {
          that.hide()
        }, this.options.delayOut)
        this.tip().data('leaveTimer', leaveTimer)
      }
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.hovercard = function (options) {
    var name = 'hovercard'

    if (typeof options == 'object') options = $.extend({}, $.fn.hovercard.defaults, options)
    $.fn.twipsy.initWith.call(this, options, Hovercard, name)

    // bind events to the popover window
    $('.popover').live('mouseenter', function() {
      $(this).data(twipsyData).enter()
    }).live('mouseleave', function() {
      $(this).data(twipsyData).leave()
    })

    // bind events to the popover parent element
    this.live('mouseenter', function() {
      $(this).data(name).enter()
    }).live('mouseleave', function() {
      $(this).data(name).leave()
    })
    return this
  }

  $.fn.hovercard.defaults = $.extend({}, $.fn.twipsy.defaults, {
    content: 'data-content'
  , trigger: 'manual'
  , placement: findPlacement
  , html: true
  })

}( window.jQuery || window.ender );

