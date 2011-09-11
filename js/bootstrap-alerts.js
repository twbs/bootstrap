/* ==========================================================
 * bootstrap-alerts.js
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

 /* ALERT CLASS DEFINITION
  * ====================== */

  var Alert = function ( content ) {
    var that = this
    this.$element = $(content)
      .bind('alert:hide', $.proxy(this.close, this))
      .delegate('.close', 'click', function (e) {
        e.preventDefault()
        that.close()
      })
  }

  Alert.prototype = {

    close: function () {
      var that = this

      this.$element.removeClass('in')

      function removeElement () {
        that.$element.remove()
        that.$element = null
      }

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element.bind(transitionEnd, removeElement) :
        removeElement()
    }

  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function ( options ) {
    return this.each(function () {
      new Alert(this)
    })
  }

})( jQuery || ender )