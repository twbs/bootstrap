/* ==========================================================
 * bootstrap-carousel.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
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
 * ========================================================== */


!function( $ ){

  "use strict"

 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element) {
    this.$element = $(element)
  }

  Carousel.prototype = {

    cycle: function () {
      this.interval = setInterval($.proxy(this.next, this), 5000)
    }

  , pause: function () {
      clearInterval(this.interval)
    }

  , next: function () {
      this.slide('next')
    }

  , prev: function () {
      this.slide('prev')
    }

  , slide: function (type) {
      var $active = this.$element.find('.active')
        , $next = $active[type]()
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if (!$.support.transition && this.$element.hasClass('slide')) {
        $active.removeClass('active')
        $next.addClass('active')
      } else {
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
        })
      }
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
      if (!data) $this.data('carousel', (data = new Carousel(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this)
        , $target = $($this.attr('data-target') || $this.attr('href'))

      $target.carousel($this.attr('data-slide'))
    })
  })

}( window.jQuery )