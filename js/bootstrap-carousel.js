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
    this.cycle()
  }

  Carousel.prototype = {

    cycle: function () {
      this.interval = setInterval($.proxy(this.right, this), 500)
    }

  , pause: function () {
      clearInterval(this.interval)
    }

  , right: function () {

    }

  , left: function () {

    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
      if (!data) $this.data('carousel', (data = new Carousel(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.carousel.Constructor = Carousel

}( window.jQuery )