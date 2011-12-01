/* ==========================================================
 * bootstrap-alert.js v2.0.0
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

 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function ( el ) {
        $(el).delegate(dismiss, 'click', this.close)
      }

  Alert.prototype = {

    constructor: Alert

  , close: function ( e ) {
      var $element = $(this)

      $element = $element.hasClass('alert-message') ? $element : $element.parent()
      e && e.preventDefault()
      $element.removeClass('in')

      function removeElement() {
        $element.remove()
      }

      $.support.transition && $element.hasClass('fade') ?
        $element.bind($.support.transition.end, removeElement) :
        removeElement()
    }

  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Alert = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').delegate(dismiss, 'click.alert.data-api', Alert.prototype.close)
  })

}( window.jQuery || window.ender )