/* ==========================================================
 * bootstrap-carousel.js v2.0.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
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
 * ========================================================== */


!function( $ ){

  "use strict"

 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
    
    this.touch = {
       supported: "ontouchend" in document
    ,  startedAt: 0
    ,  endedAt: 0
    ,  startX: 0
    ,  endX: 0
    ,  startY: 0
    ,  endY: 0
    ,  isScroll: false
    }
    
    if (this.options.touch && this.touch.supported == true) {
      this.$element
        .on('touchstart', $.proxy(this.touchstart, this))
        .on('touchmove', $.proxy(this.touchmove, this))
        .on('touchend', $.proxy(this.touchend, this))

      this.options.touchHideControls && this.$element
        .children('.carousel-control').fadeOut('slow')
    }
  }

  Carousel.prototype = {

    cycle: function () {
      this.options.interval
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function () {
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if (!$.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger('slide')
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      } else {
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.trigger('slide')
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      }

      isCycling && this.cycle()

      return this
    }
    
  , touchstart: function(e) {
      this.touch.startedAt = e.timeStamp
      this.touch.startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX
      this.touch.startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY
    }
    
  , touchmove: function(e) {
      this.touch.endX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX
      this.touch.endY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY
      
      this.touch.isScroll = !!(Math.abs(this.touch.endX - this.touch.startX) < Math.abs(this.touch.endY - this.touch.startY))
      
      !this.touch.isScroll && e.preventDefault();
    }

  , touchend: function(e) {
      this.touch.endedAt = e.timeStamp
      var distance = (this.touch.startX === 0) ? 0 : Math.abs(this.touch.endX - this.touch.startX)
      
      if (!this.touch.isScroll && this.touch.startedAt !== 0) {
        if ((this.touch.endedAt - this.touch.startedAt) < this.options.touchMaxTime && distance > this.options.touchMaxDistance) {
          if (this.touch.endX < this.touch.startX) {
            this.next().pause();
          } else if (this.touch.endX > this.touch.startX) {
            this.prev().pause();
          }
        }
      }
      
      this.touch.startedAt = 0
      this.touch.endedAt = 0
      this.touch.startX = 0
      this.touch.endX = 0
      this.touch.startY = 0
      this.touch.endY = 0
      this.touch.isScroll = false
    }
  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  , touch: true
  , touchMaxTime: 1000
  , touchMaxDistance: 50
  , touchHideControls: true
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}( window.jQuery );