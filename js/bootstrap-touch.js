/* ===================================================
 * bootstrap-touch.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#touch
 * ===================================================
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

!function( $ ) {
    "use strict"

    /* TOUCH SUPPORT */

    $.support.touch = (function () {
      return ("ontouchend" in document)
    })()

    /* TOUCH CLASS DEFINITION */

    var Touch = function (element,options) {
        this.$element = $(element)
        this.options = options

        this.touch = this.build()

        $.support.touch && this.$element
            .on('touchstart', $.proxy(this.start, this))
            .on('touchmove', $.proxy(this.move, this))
            .on('touchend', $.proxy(this.end, this))
    }

    Touch.prototype = {
        build: function() {
            return {
                startedAt: 0
            ,   endedAt: 0
            ,   startX: 0
            ,   endX: 0
            ,   startY: 0
            ,   endY: 0
            ,   isScroll: false
            }
        }

      , start: function(e) {
            this.touch.startedAt = e.timeStamp
            this.touch.startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX
            this.touch.startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY
        }

      , move: function(e) {
            this.touch.endX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX
            this.touch.endY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY

            this.touch.isScroll = !!(Math.abs(this.touch.endX - this.touch.startX) < Math.abs(this.touch.endY - this.touch.startY))

            !this.touch.isScroll && e.preventDefault()
        }

      , end: function(e) {
            this.touch.endedAt = e.timeStamp
            var distance = (this.touch.startX === 0) ? 0 : Math.abs(this.touch.endX - this.touch.startX)

            if (!this.touch.isScroll && this.touch.startedAt !== 0) {
                if ((this.touch.endedAt - this.touch.startedAt) < this.options.touchMaxTime && distance > this.options.touchMaxDistance) {
                    if (this.touch.endX < this.touch.startX) {
                        this.$element.trigger('swipe',['left'])
                    } else if (this.touch.endX > this.touch.startX) {
                        this.$element.trigger('swipe',['right'])
                    }
                }
            }

            this.touch = this.build()
        }
    }

    /* TOUCH PLUGIN DEFINITION */

    $.fn.touch = function ( option ) {
        return this.each(function () {
            var $this = $(this)
            , data = $this.data('touch')
            , options = $.extend({}, $.fn.touch.defaults, typeof option == 'object' && option)

            if (!data) $this.data('touch', (data = new Touch(this, options)))
        })
    }

    $.fn.touch.defaults = {
        touchMaxTime: 1000
    ,   touchMaxDistance: 50
    }

    $.fn.touch.Constructor = Touch
}( window.jQuery );